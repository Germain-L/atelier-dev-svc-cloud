import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import {ResponseData} from "../../../types/reponse_data";

async function getMovie(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    try {
        const { idMovie } = req.query;
        const client = await clientPromise;
        const db = client.db("sample_mflix");
        const movie = await db.collection("movies").findOne({ _id: new ObjectId(idMovie as string) });

        if (!movie) {
            return res.status(404).json({ status: 404, data: "Movie not found" });
        }

        res.status(200).json({ status: 200, data: movie });
    } catch ({ message }) {
        res.status(500).json({ status: 500, data: message });
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    switch (req.method) {
        case 'GET':
            await getMovie(req, res);
            break;
        case 'POST':
            // Implement POST logic or return 501 Not Implemented
            res.status(501).end();
            break;
        case 'PUT':
            // Implement PUT logic or return 501 Not Implemented
            res.status(501).end();
            break;
        case 'DELETE':
            // Implement DELETE logic or return 501 Not Implemented
            res.status(501).end();
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
