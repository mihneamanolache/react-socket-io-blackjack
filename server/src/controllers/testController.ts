import {Router, Request, Response} from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        type:"Success",
        msg:"Server is up and running"
    })
})

export default router;