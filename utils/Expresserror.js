class Expresserror extends Error{
    constructor(message,statuscode)
    {
        super();
        this.message=message;
        this.status=statuscode;
    }
}
module.exports=Expresserror;