
export default class BaseResolveConfig
{

    constructor(methodName, schemaName, args, returnType)
    {
        if(methodName === undefined) throw new Error('Method name not set!');
        if(schemaName === undefined) throw new Error('Schema name not set!');

        this.methodName = methodName;
        this.schemaName = schemaName;
        this.args = args === undefined || args === null ? null : args;
        // If null mean scalar Type
        this.returnType = returnType === undefined ?  null : returnType;
    }

}

