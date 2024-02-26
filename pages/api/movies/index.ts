import {NextApiRequest, NextApiResponse} from 'next';
import clientPromise from "../../../lib/mongodb";

type ResponseData = {
    status: number;
    data: any[];
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>) {
    const client = await clientPromise;
    const db = client.db("sample_mflix");
    const movies = await db.collection("movies")
        .find({})
        .limit(10)
        .toArray();

    res.json({status: 200, data: movies})
}