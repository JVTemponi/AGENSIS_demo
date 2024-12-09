require('dotenv').config({ path: '../../.env' });
const { google } = require('googleapis');
const express = require('express');

class AgendaRoutes {
    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
        this.oauth2Client = new google.auth.OAuth2(
            process.env.CLIENT_ID,
            process.env.SECRET_ID,
            process.env.REDIRECT
        );
    }

    initializeRoutes() {
        this.router.get('/agenda/autenticacao', (req, res) => {
            const url = this.oauth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: [
                    'https://www.googleapis.com/auth/calendar.readonly',
                    'https://www.googleapis.com/auth/calendar.events',
                    'https://www.googleapis.com/auth/calendar'
                ]
            });
            res.redirect(url);
        });

        this.router.get('/redirect', (req, res) => {
            const code = req.query.code;
            this.oauth2Client.getToken(code, (err, tokens) => {
                if (err) {
                    console.error('Erro ao recuperar tokens:', err);
                    return res.status(500).send('Erro ao recuperar tokens');
                }
                this.oauth2Client.setCredentials(tokens);
                req.session.googleToken = tokens; // Armazena o token na sessão
                res.redirect('http://localhost:5173/agenda'); // Redireciona para o frontend
            });
        });

        this.router.get('/agenda/eventos', async (req, res) => {
            try {
                // Verifique se o OAuth2Client tem um token
                if (!req.session.googleToken) {
                    return res.status(401).json({ message: "Usuário não autenticado. Faça a autenticação." });
                }

                this.oauth2Client.setCredentials(req.session.googleToken); // Define o token ao client
                const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
                const todosCalendarios = await calendar.calendarList.list();
                const calendarioAgensis = todosCalendarios.data.items;

                let agensisCalendar = calendarioAgensis.find(cal => cal.summary === "AGENSIS");
                if (!agensisCalendar) {
                    const newCalendar = await calendar.calendars.insert({
                        requestBody: {
                            summary: "AGENSIS",
                            timeZone: 'America/Sao_Paulo'
                        }
                    });
                    agensisCalendar = newCalendar.data;
                }

                const eventosResponse = await calendar.events.list({
                    calendarId: agensisCalendar.id,
                    timeMin: new Date().toISOString(),
                    maxResults: 10,
                    singleEvents: true,
                    orderBy: 'startTime',
                });

                const eventosFormatados = eventosResponse.data.items.map(event => ({
                    id: event.id,
                    title: event.summary,
                    description: event.description,
                    startDate: event.start.dateTime,
                    endDate: event.end.dateTime
                }));

                res.json(eventosFormatados);
            } catch (error) {
                console.error('Erro ao listar eventos:', error);
                res.status(500).send('Erro ao listar eventos');
            }
        });
    }

    getRouter() {
        return this.router;
    }
}

module.exports = new AgendaRoutes().getRouter();

