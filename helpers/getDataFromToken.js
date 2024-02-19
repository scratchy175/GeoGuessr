import jwt from "jsonwebtoken";

export const getDataFromToken = (request) => {

    try {
        const token = request.cookies.get("next-auth.session-token")?.value || "";
        const decodedToken = jwt.verify(token, process.env.NEXTAUTH_SECRET);
        console.log(decodedToken);
        return decodedToken.id;
       

    } catch (error) {
        throw new Error(error.message)

    }

}