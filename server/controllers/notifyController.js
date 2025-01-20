// controllers/notifyController.js
const nodemailer = require('nodemailer');
const prisma = require('../prismaClient');

// Configurația transportatorului SMTP
const transporter = nodemailer.createTransport({
    secure: true,
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: 'braetegladis22@stud.ase.ro',  // Definește în fișierul .env
        pass: 'xplpawhnfcbhsitc'
    }
});

// Funcția de trimitere email colaboratorilor
const sendProjectNotifications = async (collaborators, projectName) => {
    const mailOptions = {
        from: '"Project Notification" <no-reply@yourdomain.com>',
        subject: `You have been added to project: ${projectName}`,
        text: `Dear collaborator,\n\nYou have been added to the project "${projectName}".\n\nPlease check your dashboard for details.\n\nBest regards, \nProject Team`
    };

    try {
        // Trimitere emailuri către toți colaboratorii
        const emailPromises = collaborators.map(email =>
            transporter.sendMail({ ...mailOptions, to: email })
        );

        await Promise.all(emailPromises);
        console.log('All emails sent successfully.');
    } catch (error) {
        console.error('Failed to send email notifications:', error);
        throw new Error('Error sending emails');
    }
};

const sendProjectDeadlineNotifications = async (collaborators, projectName, deadline) => {
    const formattedDeadline = new Date(deadline).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const mailOptions = {
        from: '"Project Notification" <no-reply@yourdomain.com>',
        subject: `Reminder: Upcoming deadline for project "${projectName}"`,
        text: `Dear collaborator,\n\nThis is a reminder that the deadline for the project "${projectName}" is approaching.\n\nThe final deadline is on ${formattedDeadline}.\n\nPlease make sure to complete your assigned tasks in time.\n\nBest regards,\nProject Team`
    };

    try {
        const emailPromises = collaborators.map(async (email) => {
            try {
                await transporter.sendMail({ ...mailOptions, to: email });
                console.log(`Email sent to: ${email}`);
            } catch (error) {
                console.error(`Failed to send email to: ${email}`, error);
            }
        });

        await Promise.all(emailPromises);  // Așteptăm toate emailurile în paralel
        console.log(`Deadline reminder emails sent successfully for project: ${projectName}`);
    } catch (error) {
        console.error(`Failed to send deadline reminder emails for project: ${projectName}`, error);
        throw new Error('Error sending deadline reminder emails');
    }
};


// Funcția de verificare a proiectelor cu deadline azi sau mâine
const checkProjectDeadlines = async () => {
    try {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);  // Setăm ora la 00:00 UTC fără a schimba ziua
        const todayStart = new Date(today);  // Convertire la obiect Date

        // Setează sfârșitul zilei de mâine la 23:59:59.999
        const tomorrow = new Date(today);
        tomorrow.setUTCDate(today.getUTCDate() + 1);
        tomorrow.setUTCHours(23, 59, 59, 999);
        const tomorrowEnd = new Date(tomorrow);

        console.log(`Checking deadlines between: ${todayStart.toISOString()} and ${tomorrowEnd.toISOString()}`);

        // Căutăm proiectele cu deadline azi sau mâine în baza de date (folosind timestamp)
        const projectsWithDeadlines = await prisma.project.findMany({
            where: {
                deadline: {
                    gte: todayStart,   // De la începutul zilei de azi în ms
                    lt: tomorrowEnd  // Până la începutul zilei de mâine în ms
                }
            },
            include: {
                collaborators: true
            }
        });

        if (projectsWithDeadlines.length === 0) {
            console.log('No upcoming deadlines to notify.');
            return;
        }

        console.log(`Found ${projectsWithDeadlines.length} projects with approaching deadlines.`);

        // Trimiterea notificărilor pentru fiecare proiect
        for (const project of projectsWithDeadlines) {
            const collaboratorsEmails = project.collaborators.map(collab => collab.email);
            await sendProjectDeadlineNotifications(collaboratorsEmails, project.title, project.deadline);
        }
    } catch (error) {
        console.error('Error checking project deadlines:', error);
    }
};

// Funcția de verificare zilnică la fiecare 24 de ore
const checkDaily = () => {
    setInterval(async () => {
        console.log('Running daily project deadline check...');
        await checkProjectDeadlines();
    }, 24*60*60*1000); // Rulează la fiecare 24 de ore
};

// Inițializăm procesul de verificare zilnică
checkDaily();
console.log('Daily deadline checker started...');

module.exports = { sendProjectNotifications };