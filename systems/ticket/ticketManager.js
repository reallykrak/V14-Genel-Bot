const { ChannelType, PermissionFlagsBits, PermissionsBitField, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = class TicketManager {
    constructor(client) {
        this.client = client;
        this.database = client.utils.database.tickets;
    }

    async createTicket(interaction) {
        // Your logic to create a ticket channel
        // Example: Create channel, set permissions, send initial message with buttons
        const guild = interaction.guild;
        const user = interaction.user;

        // Basic check
        const existingTicket = this.database.get(user.id);
        if (existingTicket) {
             // Check if channel still exists
             const channel = guild.channels.cache.get(existingTicket.channelId);
             if (channel) {
                return interaction.reply({ content: `Zaten açık bir ticketiniz var: ${channel}`, ephemeral: true });
             } else {
                 this.database.delete(user.id); // Clean up stale data
             }
        }


        try {
            const ticketChannel = await guild.channels.create({
                name: `ticket-${user.username}`,
                type: ChannelType.GuildText,
                parent: 'YOUR_TICKET_CATEGORY_ID', // Replace with your ticket category ID
                permissionOverwrites: [
                    {
                        id: guild.id,
                        deny: [PermissionsBitField.Flags.ViewChannel],
                    },
                    {
                        id: user.id,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
                    },
                     {
                        id: 'YOUR_SUPPORT_ROLE_ID', // Replace with your support role ID
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
                     },
                ],
            });

            // Save ticket info to database
            this.database.set(user.id, { channelId: ticketChannel.id, userId: user.id, status: 'open', createdAt: Date.now() });

            const closeButton = this.client.utils.buttonManager.createTicketCloseButton(); // Uses helper
            const claimButton = this.client.utils.buttonManager.createTicketClaimButton(); // Uses helper
            const row = this.client.utils.buttonManager.createActionRow(claimButton, closeButton);

            const initialEmbed = this.client.utils.embedManager.createEmbed(
                'Yeni Ticket',
                `Destek talebiniz oluşturuldu, yetkililerimiz en kısa sürede sizinle ilgilenecektir.\n\nSorununuzu veya talebinizi detaylıca anlatın.`
            );

            await ticketChannel.send({ content: `${user}`, embeds: [initialEmbed], components: [row] });
            await interaction.reply({ content: `Ticketiniz oluşturuldu: ${ticketChannel}`, ephemeral: true });

        } catch (error) {
            console.error('[TICKET] Error creating ticket:', error);
             await interaction.reply({ content: 'Ticket oluşturulurken bir hata oluştu!', ephemeral: true });
        }
    }

    async closeTicket(interaction) {
        // Your logic to close/delete a ticket channel
        // Example: Check if it's a ticket channel, confirm, maybe log reason
         const channel = interaction.channel;
         const user = interaction.user;
         const ticketData = this.database.find(t => t.channelId === channel.id && t.userId === user.id); // Find if the user is the ticket owner

         if (!ticketData && !interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
             return interaction.reply({ content: 'Bu ticket sizin değil veya kapatma yetkiniz yok.', ephemeral: true });
         }

         // Ask for reason via modal
         const modal = new ModalBuilder()
            .setCustomId(`ticket_close_reason_modal_${channel.id}`)
            .setTitle('Ticket Kapatma Sebebi');

         const reasonInput = new TextInputBuilder()
            .setCustomId('reason')
            .setLabel('Lütfen kapatma sebebini belirtin:')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false);

         const firstActionRow = new ActionRowBuilder().addComponents(reasonInput);
         modal.addComponents(firstActionRow);

         await interaction.showModal(modal);

    }

    async handleButtonInteraction(interaction) {
        const customId = interaction.customId;
        if (customId === 'ticket_create') {
            await this.createTicket(interaction);
        } else if (customId === 'ticket_close') {
             await this.closeTicket(interaction);
        } else if (customId === 'ticket_claim') {
             // Your logic to claim a ticket
             console.log('[TICKET] Handling claim button.');
             await interaction.reply({ content: 'Ticket alındı.', ephemeral: true });
        }
    }

     async handleModalSubmit(interaction) {
         if (interaction.customId.startsWith('ticket_close_reason_modal_')) {
             const channelId = interaction.customId.split('_')[4];
             const reason = interaction.fields.getTextInputValue('reason') || 'Sebep belirtilmedi.';
             const channel = interaction.guild.channels.cache.get(channelId);

             if (!channel) {
                  return interaction.reply({ content: 'Ticket kanalı bulunamadı.', ephemeral: true });
             }

             // Your logic to perform the close (e.g., archive, delete, log)
             try {
                 await interaction.reply({ content: 'Ticket kapatılıyor...', ephemeral: true });
                 // Save reason and close
                 const ticketData = this.database.find(t => t.channelId === channelId);
                 if(ticketData) {
                     ticketData.closeReason = reason;
                     ticketData.closedBy = interaction.user.id;
                     ticketData.closedAt = Date.now();
                     ticketData.status = 'closed';
                     this.database.set(ticketData.userId, ticketData); // Update or delete
                     // Consider deleting the entry entirely or archiving it elsewhere
                     this.database.delete(ticketData.userId); // Example: Delete from active tickets
                 }

                 // Option 1: Delete the channel
                 await channel.delete(`Ticket closed by ${interaction.user.tag} - Reason: ${reason}`).catch(console.error);

                 // Option 2: Archive the channel (e.g., move to a closed category and remove view perms)
                 // await channel.setParent('YOUR_CLOSED_TICKET_CATEGORY_ID');
                 // await channel.permissionOverwrites.edit(ticketData.userId, { ViewChannel: false });


                 console.log(`[TICKET] Ticket ${channel.name} closed by ${interaction.user.tag}. Reason: ${reason}`);

             } catch (error) {
                  console.error('[TICKET] Error closing ticket:', error);
                  await interaction.followUp({ content: 'Ticket kapatılırken bir hata oluştu!', ephemeral: true }).catch(console.error);
             }
         }
     }
};
              
