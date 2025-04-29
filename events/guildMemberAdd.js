const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    execute(member, client) {
        console.log(`[MEMBER JOIN] ${member.user.tag} (${member.id}) sunucuya katıldı: ${member.guild.name}`);
        // Hoş geldin sistemini tetikle
        client.systems.welcome?.sendWelcomeMessage(member);
        // Varsa otomatik rol verme vb. işlemleri yap
        // client.systems.autorole?.assignRole(member);
    },
};
