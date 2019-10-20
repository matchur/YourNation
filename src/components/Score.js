import React from 'react';

export const Score = ({ amount, progress, icon }, index) => {
    return (
        <div key={index} className="scoreContainer">

            <div className="scoreItem">
                <img src={icon} alt="icon" />
                <p><span id="industria">+ U$ {Number(amount).toFixed(2)}</span></p>
            </div>
            <div className="progresso">
                <span className="fill-progresso" style={{ width: `${progress}%` }}></span>
            </div>
        </div>
    );
};



