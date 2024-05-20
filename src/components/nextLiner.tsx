import React from 'react';

const NextLiner = ({ text }: { text: string }) => {
    return (
        <div>
            { text.split('\n').map((txt, i) => (
                <span key={`${txt}-${i}`}>
                    {txt}
                    <br />
                </span>
            ))}
        </div>
    );
};

export default NextLiner;