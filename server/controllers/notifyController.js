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

const sendEvaluatorNotification = async (email,projectId) => {
    const projectLink = `https://d1nci5bgxg7422.cloudfront.net/login?redirect=/project/${projectId}`;
    //const projectLink = `https://localhost:3000/login?redirect=/project/${projectId}`; idk why doesnt work
    const mailOptions = {
        from: '"Project Notification" <no-reply@yourdomain.com>',
        subject: 'You have been selected as an evaluator',
        text: `You have been selected to evaluate the project. Click the link below to access it:
        ${projectLink}`
    };

    try {
        await transporter.sendMail({ ...mailOptions, to: email });
        console.log(`Evaluator email sent to: ${email}`);
    } catch (error) {
        console.error(`Failed to send evaluator email to: ${email}`, error);
    }
};

const selectRandomEvaluators = async (projectId) => {
    const allUsers = await prisma.user.findMany();
    const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { collaborators: true }
    });
    const projectCollaboratorsEmails = project.collaborators.map(collab => collab.email);
    const eligibleUsers = allUsers.filter(user => !projectCollaboratorsEmails.includes(user.email));
    const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);
    const selectedEvaluators = shuffleArray(eligibleUsers).slice(0, 3);

    console.log(`Selected evaluators for project ${projectId}:`, selectedEvaluators.map(e => e.email));

    if (selectedEvaluators.length === 0) {
        console.warn(`No eligible evaluators found for project ${projectId}`);
        return;
    }

    for (const evaluator of selectedEvaluators) {
        try {
            await sendEvaluatorNotification(evaluator.email,projectId);
        } catch (error) {
            console.error(`Error sending email to ${evaluator.email}:`, error);
        }
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
                collaborators: true,
                evaluations: {
                    select: { id: true }  // Ensure evaluations are selected properly
                }
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
            if (project.evaluations.length === 0) {
                await selectRandomEvaluators(project.id);
            }
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