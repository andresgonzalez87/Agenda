import { Request, Response } from "express";
import { Meeting } from "../models/meeting";

export const getMeetings = async (req: Request, res: Response) => {
    try {
        const listMeetings = await Meeting.findAll();
        res.json(listMeetings); // Envía la respuesta JSON con la lista de reuniones
    } catch (error) {
        console.error("Error al obtener reuniones:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

export const newMeeting = async (req: Request, res: Response) => {
    console.log("Solicitud POST recibida para crear una nueva reunión");

    const { title, detail, date, startTime, duration } = req.body;

    // Validamos si la reunión ya existe en la base de datos
    try {
        // Validamos si la reunión ya existe en la base de datos
        const meeting = await Meeting.findOne({ where: { title: title } });

        if (meeting) {
            return res.status(400).json({
                msg: `Ya existe una reunión con el nombre ${title}`
            });
        }

        // Verificamos si ya existe una reunión con la misma fecha y hora de inicio
        const existingMeeting = await Meeting.findOne({
            where: {
                // date: date,
                date: new Date(date).toISOString(),
                startTime: startTime
            }
        });

        if (existingMeeting) {
            return res.status(400).json({
                msg: `Ya existe una reunión en la fecha ${date} y hora de inicio ${startTime}`
            });
        };

        const totalMeetings = await Meeting.count();
        if (totalMeetings >= 20) {
            return res.status(400).json({
                msg: "Ya se alcanzó el límite máximo de reuniones permitidas (20)."
            });
        }

        // Guardarmos usuario en la base de datos
        await Meeting.create({
            title: title,
            detail: detail,
            date: date,
            startTime: startTime,
            duration: duration
        })

        res.json({
            msg: `Reunión ${title} creada exitosamente!`
        })
    } catch (error) {
        res.status(400).json({
            msg: 'Upps ocurrio un error',
            error
        })
    }
};

export const deleteMeeting = async (req: Request, res: Response) => {
    const meetingId = req.params.id;

    try {
        // Buscamos la reunión por su id
        const meeting = await Meeting.findByPk(meetingId);

        if (!meeting) {
            return res.status(404).json({
                msg: `No se encontró una reunión con id ${meetingId}`
            });
        }

        // Eliminamos la reunión
        await meeting.destroy();

        res.json({
            msg: `Reunión con id ${meetingId} eliminada exitosamente!`
        });
    } catch (error) {
        console.error("Error al eliminar reunión:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};



