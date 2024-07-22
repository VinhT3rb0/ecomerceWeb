import React, { useState } from 'react';
import SearchBar from './SearchBar';

const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const data = [
        'Apple',
        'Banana',
        'Cherry',
        'Date',
        'Elderberry',
        'Fig',
        'Grape'
    ];

    const filteredData = data.filter((item) =>
        item.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <SearchBar onSearch={setSearchTerm} />
            <ul>
                {filteredData.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    );
};

export default App;
