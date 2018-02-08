import React from 'react';
import Template from '@AndevisReactBundle/Resources/react/components/Template';

export default new Template(
    ({
     value,
     searchResults,
     eventChange,
     eventSave
    }) => (
    <div>
        <input type="text" onChange={eventChange} />
        <ul className="result">
            { searchResults && searchResults.map((item, i) => (
                <li key={i}>{item.key}:{item.value}</li>
            ))}
        </ul>
        <button onClick={eventSave}>Save</button>
    </div>
));
