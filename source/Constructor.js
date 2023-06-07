class Constructor
{
    objectMap = new Map();
    styleMap = new Map();
    nameProps = ['globalName', 'id', 'selector', 'class'];
    blockProps = ["globalName", 'type', 'selector'];

    constructor(filePath)
    {
        addEventListener('DOMContentLoaded', () => 
        {
            fetch(filePath).then((resp) => 
            {
                resp.text().then((text) => 
                {
                    var json = JSON.parse(text);
                    this.parseElements(json.elements);
                    this.parseStyles(json.styles);
                });
            });
        });
    }

    parseElements = (elements) =>
    {
        elements.forEach((object) => 
        {
            console.log(object);

            var selector = "el" + Math.round(Math.random() * 0x7ffffffe);
            this.nameProps.forEach((name) =>
            {
                if (Reflect.has(object, name))
                    selector = name;
            });
            console.log(selector);

            var ref = this.objectMap[selector] = document.createElement(object.type);
            for (var propertyName in object)
            {
                if (this.blockProps.includes(propertyName))
                    continue;

                var propertyValue = object[propertyName];
                if (Reflect.has(ref, propertyName))
                    Reflect.set(ref, propertyName, propertyValue);
                else
                    console.error(`Couldn't find ${propertyName}`);
            }
            document.body.appendChild(ref);
        });
    }

    parseStyles = (styles) =>
    {
        styles.forEach((object) =>
        {
            console.log(object);

            var method = "?";
            var ref = undefined;

            if (Reflect.has(object, 'globalName'))
            {
                ref = this.objectMap[object.globalName].style;
                method = 'direct-mut'; // direct mutation
            }
            else
            {
                ref = this.styleMap[object.selector] = document.createElement('style');
                method = 'style-el'; // style element
            }

            console.log(ref);
            for (var propertyName in object)
            {
                if (this.blockProps.includes(propertyName))
                    continue;

                var propertyValue = object[propertyName];
                switch(method)
                {
                    case 'direct-mut':
                        if (Reflect.has(ref, propertyName))
                            Reflect.set(ref, propertyName, propertyValue);
                        else
                            console.error(`Couldn't find ${propertyName}`);
                        break;
                    case 'style-el':
                        ref.innerHTML = `${object.selector} { ${propertyName}: ${propertyValue} }`;
                        break;
                }
            }

            if (method == 'style-el')
                document.head.appendChild(ref);
        });
    }
}