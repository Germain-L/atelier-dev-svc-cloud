import {NextApiRequest, NextApiResponse} from "next";
import {ResponseData} from "../../../../../types/reponse_data";

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    switch (req.method) {
        case 'GET':
            res.status(501).end();
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
