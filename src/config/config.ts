class Locals {
    public static config(): any {
        const mongoUrl = "mongodb://localhost:27017/soccerfy";
        const secretKey = "%^&^*&-*({SC-554c-234!";
        return {
            mongoUrl,
            secretKey
        };
    }
}
export default Locals;
