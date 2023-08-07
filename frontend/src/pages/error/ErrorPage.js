import React, { useContext } from 'react';
import { Context } from '../../index';
import { observer } from 'mobx-react-lite';
import './css/ErrorPage.css'

const ErrorPage = observer(() => {
    const {messages} = useContext(Context);

    return (
        <div className='errorFonPage'>
            <h1
                style={{
                    marginTop: '10%'
                }}
            >
                {messages.messageError}
            </h1>
        </div>
    );
});

export default ErrorPage;