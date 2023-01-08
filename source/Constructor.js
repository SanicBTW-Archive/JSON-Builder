class Constructor
{
    objectMap = {};
    styleMap = {};

    constructor(filePath)
    {
        addEventListener('DOMContentLoaded', () => 
        {
            fetch(filePath).then((resp) => 
            {
                resp.text().then((text) => 
                {
                    this.parseFile(JSON.parse(text));
                });
            });
        });
    }

    parseFile = (parsedJSON) =>
    {
        for (var i in parsedJSON.elements)
        {
            var object = parsedJSON.elements[i];
            var element = this.objectMap[object.globalName] = document.createElement(object.type);
            for (var property in object)
            {
                // if this gets too big i will switch to switch statmenet
                if (property == "globalName" || property == "type") // skip these properties cuz they are already used
                    continue;
                else
                {
                    if(Reflect.has(element, property))
                    {
                        Reflect.set(element, property, object[property]);
                    }
                    else
                        console.log(`${property} seems to be null`);
                }
            }
            document.body.appendChild(element);
        }
    }
}