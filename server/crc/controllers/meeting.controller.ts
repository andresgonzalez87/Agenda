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

