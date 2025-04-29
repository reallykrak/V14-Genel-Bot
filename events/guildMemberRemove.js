const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildMemberRemove,
    execute(member, client) {
         console.log(`[MEMBER LEAVE] ${member.user.tag} (${member.id}) sunucudan ayrıldı: ${member.guild.name}`);
        // Güle güle mesajı sistemini tetikle (eğer varsa)
        client.systems.welcome?.sendGoodbyeMessage(member); // veya ayrı bir goodbye sistemi
        // Kullanıcı verilerini temizleme vb. (isteğe bağlı)
         client.systems.level?.removeUserData(member.id, member.guild.id);
    },
};
