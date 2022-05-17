import React, { useState, useEffect } from 'react';
import internal from 'stream';
import { wave } from '../axiosInstances';

export interface DonateFormProps {
    campaign: string;
    onTabCreated: (tab: any) => void,
}

function DonateForm(props: DonateFormProps) {
    const [amount, setAmount] = useState("");
    const [email, setEmail] = useState("");
    const [fullName, setFullname] = useState("");
    const [memo, setMemo] = useState("");
    const [addNote, setAddNote] = useState(false);
    const [addIdentity, setAddIdentity] = useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const inputData = {
            campaign_slug: props.campaign,
            amount: parseInt((Number(amount) * 100).toString()),
            email,
            name: fullName,
            comment: memo,
        };
        wave.post("/tab", inputData).then((result) => {
            console.log(result.data);
            props.onTabCreated({
                tabId: result.data['tab_id'],
                url: result.data['url'],
            });
        })
    }

    return (
        <div className="2fua-donate-form">
            <div className='sfua-donate-form__amount-select'>
                <span><a href="#" onClick={() => setAmount("25.00")}>$25</a> | <a href="#" onClick={() => setAmount("50.00")}>$50</a> | <a href="#" onClick={() => setAmount("100.00")}>$100</a></span>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="sfua-donate-form__input-box">
                    <span className="sfua-donate-form__input-box__prefix">CAD</span>
                    <input
                        type="text"
                        name="amount"
                        value={amount}
                        placeholder="Amount"
                        className='sfua-donate-form__input-box__large'
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
                {!addIdentity || !addNote ? (
                    <div className='sfua-donate-form__add'>
                        {!addIdentity ? (
                            <a href="#" onClick={() => setAddIdentity(true)}>Include email to receive updates</a>
                        ) : null}
                        {addIdentity === addNote ? (" | ") : null}
                        {!addNote ? (
                            <a href="#" onClick={() => setAddNote(true)}>Add a note</a>
                        ) : null}
                    </div>
                ) : null}
                {addIdentity ? (
                    <div className="sfua-donate-form__input-box">
                        <input
                            type="text"
                            name="email"
                            value={email}
                            placeholder="Email (optional)"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                ) : null}
                {addIdentity ? (
                    <div className="sfua-donate-form__input-box">
                        <input
                            type="text"
                            name="fullName"
                            value={fullName}
                            placeholder="Full name (optional)"
                            onChange={(e) => setFullname(e.target.value)}
                        />
                    </div>
                ) : (
                    null
                )}
                {addNote ? (
                    <div className="sfua-donate-form__input-box">
                        <textarea
                            name="memo"
                            value={memo}
                            placeholder="Note (optional)"
                            rows={7}
                            onChange={(e) => setMemo(e.target.value)}
                        />
                    </div>
                ) : null}
                <div>
                    <div className="invoice-insights__payments-banner">
                        <div className="icon-override wv-icon--payment-method--small wv-icon--payment-method--bank-payment"></div>
                        <div className="icon-override wv-icon--payment-method--small wv-icon--payment-method--cc-amex"></div>
                        <div className="icon-override wv-icon--payment-method--small wv-icon--payment-method--cc-mastercard"></div>
                        <div className="icon-override wv-icon--payment-method--small wv-icon--payment-method--cc-visa"></div>
                        <div className='sfua-donate-form__submit-alt'>
                            <input type="submit" value="Donate" />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default DonateForm;
