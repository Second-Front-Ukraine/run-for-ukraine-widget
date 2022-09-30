import React, { useState, useEffect } from 'react';
import internal from 'stream';
import { wave } from '../axiosInstances';

export interface DonateFormProps {
    campaign: string;
    onTabCreated: (tab: any) => void,
}

const REGISTRATION_PRODUCT_ID = "QnVzaW5lc3M6YWU4YTgxYjYtZWI4OS00MDRhLWExNzgtYzJmYmM4OTc2ODIzO1Byb2R1Y3Q6ODIxNjg1MDQ="
const SOCKS_PRODUCT_ID = "QnVzaW5lc3M6YWU4YTgxYjYtZWI4OS00MDRhLWExNzgtYzJmYmM4OTc2ODIzO1Byb2R1Y3Q6ODIxNjg1NDM="
const BOOTS_PRODUCT_ID = "QnVzaW5lc3M6YWU4YTgxYjYtZWI4OS00MDRhLWExNzgtYzJmYmM4OTc2ODIzO1Byb2R1Y3Q6ODIzNTU1MjI="
const DELIVERY_CANADA_PRODUCT_ID = "QnVzaW5lc3M6YWU4YTgxYjYtZWI4OS00MDRhLWExNzgtYzJmYmM4OTc2ODIzO1Byb2R1Y3Q6ODIyNzI1Mjg="
const DELIVERY_OUTSIDE_CANADA_ID = "QnVzaW5lc3M6YWU4YTgxYjYtZWI4OS00MDRhLWExNzgtYzJmYmM4OTc2ODIzO1Byb2R1Y3Q6ODIzNTU4Mjc="

const provinceOptions = [
    {"label": "Alberta (AB)", "value": "CA-AB"},
    {"label": "British Columbia (BC)", "value": "CA-BC"},
    {"label": "Manitoba (MB)", "value": "CA-MB"},
    {"label": "New Brunswick (NB)", "value": "CA-NB"},
    {"label": "Newfoundland and Labrador (NL)", "value": "CA-NL"},
    {"label": "Northwest Territories (NT)", "value": "CA-NT"},
    {"label": "Nova Scotia (NS)", "value": "CA-NS"},
    {"label": "Nunavut (NU)", "value": "CA-NU"},
    {"label": "Ontario (ON)", "value": "CA-ON"},
    {"label": "Prince Edward Island (PE)", "value": "CA-PE"},
    {"label": "Quebec (QC)", "value": "CA-QC"},
    {"label": "Saskatchewan (SK)", "value": "CA-SK"},
    {"label": "Yukon (YT)", "value": "CA-YT"},
]

function DonateForm(props: DonateFormProps) {
    const [wizardStep, setWizardStep] = useState(0);
    const [email, setEmail] = useState("");
    const [fullName, setFullname] = useState("");
    const [addressLine1, setAddressLine1] = useState("");
    const [addressLine2, setAddressLine2] = useState("");
    const [addressCity, setAddressCity] = useState("");
    const [addressProvince, setAddressProvince] : [string | undefined, any] = useState(undefined);
    const [addressCountry, setAddressCountry] = useState("Canada");
    const [addressCode, setAddressCode] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [memo, setMemo] = useState("");
    const [addNote, setAddNote] = useState(false);
    const [itemsSocks, setItemsSocks] = useState(1);
    const [itemsExtraBoots, setItemsExtraBoots] = useState(0);
    const [loading, setLoading] = useState(false);

    const total = 60 + itemsExtraBoots * 60 + itemsSocks * 20 + 10;

    const step1done = !!email && !!fullName;
    const step2done = step1done && !!addressLine1 && !!addressCity && !!addressCountry && !!addressProvince && !!addressCountry && !!phoneNumber;
    const step3done = step1done && step2done && true;

    const handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        setLoading(true);
        if (step1done && step2done && step3done) {
            const inputData = {
                campaign_slug: props.campaign,
                email,
                name: fullName,
                comment: memo,
                shipping_details: {
                    'addressLine1': addressLine1,
                    'addressLine2': addressLine2,
                    'city': addressCity,
                    'provinceCode': addressProvince,
                    'countryCode': 'CA',
                    'postalCode': addressCode,
                    'phone': phoneNumber,
                },
                products: {
                    [REGISTRATION_PRODUCT_ID]: {
                        'quantity': 1,
                        'unitPrice': 6000,
                    },
                    [BOOTS_PRODUCT_ID]: {
                        'quantity': itemsExtraBoots,
                        'unitPrice': 6000,
                    },
                    [SOCKS_PRODUCT_ID]: {
                        'quantity': itemsSocks,
                        'unitPrice': 2000,
                    },
                    [DELIVERY_CANADA_PRODUCT_ID]: {
                        'quantity': 1,
                        'unitPrice': 1000,
                    },
                },
            };
            wave.post("/tab", inputData).then((result) => {
                props.onTabCreated(result.data);
            }).finally(() => {
                setLoading(false);
            });
        }
    }

    const handleAddNote = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setAddNote(!addNote);
    }

    return (
        <form className="wizard sw-main sw-theme-default">
            <ul className="d-flex step-circles mb-5 justify-content-center nav nav-tabs step-anchor">
                <li className={wizardStep == 0 ? "nav-item active" : step1done ? "nav-item done" : "nav-item"}><button type="button" className="nav-link btn" onClick={() => setWizardStep(0)}>1</button>
                </li>
                <li className={wizardStep == 1 ? "nav-item active" : step2done ? "nav-item done" : "nav-item"}><button type="button" className="nav-link btn" onClick={() => step1done && setWizardStep(1)}>2</button>
                </li>
                <li className={wizardStep == 2 ? "nav-item active" : step3done ? "nav-item done" : "nav-item"}><button type="button" className="nav-link btn" onClick={() => step2done && setWizardStep(2)}>3</button>
                </li>
            </ul>
            <div className="sw-container tab-content">
                <div id="step-1" className={wizardStep == 0 ? "active tab-pane step-content" : "tab-pane step-content"}>
                    <div className="p-4">
                        <div className="form-group">
                            <label htmlFor="register-name">Імʼя</label>
                            <input
                                type="text"
                                name="fullName"
                                id="register-name"
                                className="form-control form-control-lg"
                                value={fullName}
                                placeholder="Напишіть Ваше ім'я"
                                onChange={(e) => setFullname(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="register-email">Адреса Електронної Пошти</label>
                            <input
                                type="text"
                                name="email"
                                id="register-email"
                                className="form-control form-control-lg"
                                value={email}
                                placeholder="you@yoursite.com"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        {step1done ? <button type="button" className="btn btn-primary-2 sw-btn-next" onClick={() => setWizardStep(1)} disabled={!step1done}>Далі</button> : null}
                    </div>
                </div>
                <div id="step-2" className={wizardStep == 1 ? "active tab-pane step-content" : "tab-pane step-content"}>
                    <div className="p-4">
                        <div className="form-group">
                            <label htmlFor="register-address-country">Поштові Деталі</label>
                            <input
                                type="text"
                                name="address-country"
                                id="register-address-country"
                                className="form-control"
                                value={'Canada'}
                                placeholder="Країна"
                                disabled
                                onChange={(e) => setAddressCountry(e.target.value)}
                            />
                        </div>
                        {/* <div className="form-group">
                            <input
                                type="text"
                                name="address-province"
                                id="register-address-province"
                                className="form-control"
                                value={addressProvince}
                                placeholder="Провінція"
                                onChange={(e) => setAddressProvince(e.target.value)}
                            />
                        </div> */}
                        <div className="form-group">
                            <select
                                className="custom-select"
                                value={addressProvince}
                                placeholder={"Province"}
                                onChange={(e) => setAddressProvince(e.target.value)}
                            >
                                {provinceOptions.map((province) => {
                                    return <option selected={addressProvince === province.value} value={province.value}>{province.label}</option>;
                                })}
                            </select>
                            <img className="icon" src="assets/img/icons/interface/arrow-caret.svg" alt="arrow-caret interface icon" data-inject-svg />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="address-city"
                                id="register-address-city"
                                className="form-control"
                                value={addressCity}
                                placeholder="Місто"
                                onChange={(e) => setAddressCity(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="address-line-1"
                                id="register-address-line-1"
                                className="form-control"
                                value={addressLine1}
                                placeholder="Номер будинку і вулиця"
                                onChange={(e) => setAddressLine1(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="address-line-2"
                                id="register-address-line-2"
                                className="form-control"
                                value={addressLine2}
                                placeholder="Номер квартири (apt, suite, unit)"
                                onChange={(e) => setAddressLine2(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="address-postal-code"
                                id="register-postal-code"
                                className="form-control"
                                value={addressCode}
                                placeholder="Поштовий Код"
                                onChange={(e) => setAddressCode(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="address-phone"
                                id="register-phone"
                                className="form-control"
                                value={phoneNumber}
                                placeholder="Номер телефону"
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>
                        {step2done ? <button type="button" className="btn btn-primary-2 sw-btn-next" onClick={() => setWizardStep(2)} disabled={!step2done}>Далі</button> : null }
                    </div>
                </div>
                <div id="step-3" className={wizardStep == 2 ? "active tab-pane step-content" : "tab-pane step-content"}>
                    <div className="p-4">

                        <table className="table table-hover">
                            <tbody>
                                <tr>
                                    <td>
                                        <strong>Стартовий внесок</strong> - одна пара взуття для ЗСУ <br /> <small>Усі кошти від вашої реєстрації будуть спрямовані на закупівлю зимового взуття для українських захисників</small>
                                    </td>
                                    <td>$60</td>
                                </tr>
                                <tr>
                                    <td>
                                        <div>
                                            <label htmlFor="register-socks">🥾 {itemsExtraBoots > 0 ? <><strong>Взуття</strong> для ЗСУ</> : <>Додати <strong>ще взуття</strong> для ЗСУ?</>} <br/><small>Одна пара військового взуття <a href="https://www.patriboots.com.ua/shop/otaman-khaki-nu/" target="_blank">PatriBoots Otaman</a> $60</small></label>
                                            <input type="range" className="custom-range" id="register-socks" min={0} max={10} value={itemsExtraBoots} onChange={(e) => setItemsExtraBoots(parseInt(e.target.value))} />
                                        </div>
                                        <div className="custom-range-labels">
                                            <span>0</span>
                                            <span>1</span>
                                            <span>2</span>
                                            <span>3</span>
                                            <span>4</span>
                                            <span>5</span>
                                            <span>6</span>
                                            <span>7</span>
                                            <span>8</span>
                                            <span>9</span>
                                            <span>10</span>
                                        </div>
                                    </td>
                                    <td>{itemsExtraBoots > 0 ? `$${itemsExtraBoots * 60}` : ""}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <p>🧦 {itemsSocks > 0 ? <><strong>Військові шкарпетки</strong> для ЗСУ</> : <>Додати <strong>військові шкарпетки</strong> для ЗСУ?</>} <br/><small>Виробник професійних військових шкарпеток <a href="https://covertthreads.com" target="_blank">Covert Threads (USA)</a> підтримує Україну і надає нам суттєву знижку (по собівартості). Одна пара якісних шкарпеток з доставкою $20</small></p>
                                        <div>
                                            <input type="range" className="custom-range" id="register-socks" min={0} max={10} value={itemsSocks} onChange={(e) => setItemsSocks(parseInt(e.target.value))} />
                                        </div>
                                        <div className="custom-range-labels">
                                            <span>0</span>
                                            <span>1</span>
                                            <span>2</span>
                                            <span>3</span>
                                            <span>4</span>
                                            <span>5</span>
                                            <span>6</span>
                                            <span>7</span>
                                            <span>8</span>
                                            <span>9</span>
                                            <span>10</span>
                                        </div>
                                    </td>
                                    <td>{itemsSocks > 0 ? `$${itemsSocks * 20}` : ""}</td>
                                </tr>
                                <tr>
                                    <td><strong>Доставка</strong> <br /> <small>(Канада)</small></td>
                                    <td>$10</td>
                                </tr>
                            </tbody>
                        </table>
                        {addNote ? (
                            <div className="form-group mt-2">
                                <label htmlFor="register-memo">Коментар (<a href="#" onClick={handleAddNote}>та ні</a>)</label>
                                <textarea
                                    name="memo"
                                    id="register-memo"
                                    className="form-control"
                                    value={memo}
                                    placeholder="Залиште коментар для Другого Фронту (за бажанням)"
                                    rows={7}
                                    onChange={(e) => setMemo(e.target.value)}
                                />
                            </div>
                        ) : (
                            <div className="mt-2">
                                <a href="#" onClick={handleAddNote}>Прикріпити коментар?</a>
                            </div>
                        )}
                        <div className="mt-4">
                            <p className="lead"><strong>Усього до оплати: ${total}</strong><br /></p>
                        </div>
                        <div className="mt-3">
                            <div className='form-group text-center'>
                                <button type="button" onClick={handleSubmit} className="btn btn-lg btn-primary btn-block mb-2" disabled={loading}>Завершити реєстрацію</button>
                            </div>
                            <div className="invoice-insights__payments-banner">
                                <div className="icon-override wv-icon--payment-method--small wv-icon--payment-method--bank-payment"></div>
                                <div className="icon-override wv-icon--payment-method--small wv-icon--payment-method--cc-amex"></div>
                                <div className="icon-override wv-icon--payment-method--small wv-icon--payment-method--cc-mastercard"></div>
                                <div className="icon-override wv-icon--payment-method--small wv-icon--payment-method--cc-visa"></div>
                            </div>
                            <div className="text-center">
                                <p><small>Усі ціни вказані в Канадських Доларах (CAD)</small></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </form>
    );
}

export default DonateForm;
