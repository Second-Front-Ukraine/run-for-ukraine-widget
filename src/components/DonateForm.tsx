import React, { useState, useEffect } from 'react';
import internal from 'stream';
import { wave } from '../axiosInstances';
import { COUNTRIES } from '../geography';

export interface DonateFormProps {
  campaign: string;
  lang?: string;
  onTabCreated: (tab: any) => void,
}

const REGISTRATION_PRODUCT_ID = "QnVzaW5lc3M6YWU4YTgxYjYtZWI4OS00MDRhLWExNzgtYzJmYmM4OTc2ODIzO1Byb2R1Y3Q6ODIxNjg1MDQ="
const SOCKS_PRODUCT_ID = "QnVzaW5lc3M6YWU4YTgxYjYtZWI4OS00MDRhLWExNzgtYzJmYmM4OTc2ODIzO1Byb2R1Y3Q6ODIxNjg1NDM="
const BOOTS_PRODUCT_ID = "QnVzaW5lc3M6YWU4YTgxYjYtZWI4OS00MDRhLWExNzgtYzJmYmM4OTc2ODIzO1Byb2R1Y3Q6ODIzNTU1MjI="
const DELIVERY_CANADA_PRODUCT_ID = "QnVzaW5lc3M6YWU4YTgxYjYtZWI4OS00MDRhLWExNzgtYzJmYmM4OTc2ODIzO1Byb2R1Y3Q6ODIyNzI1Mjg="
const DELIVERY_OUTSIDE_CANADA_ID = "QnVzaW5lc3M6YWU4YTgxYjYtZWI4OS00MDRhLWExNzgtYzJmYmM4OTc2ODIzO1Byb2R1Y3Q6ODIzNTU4Mjc="
const TEE_LARGE_ID = "QnVzaW5lc3M6YWU4YTgxYjYtZWI4OS00MDRhLWExNzgtYzJmYmM4OTc2ODIzO1Byb2R1Y3Q6ODIzNzM4NzU="
const TEE_MEDIUM_ID = "QnVzaW5lc3M6YWU4YTgxYjYtZWI4OS00MDRhLWExNzgtYzJmYmM4OTc2ODIzO1Byb2R1Y3Q6ODIzNzM4NzI="
const TEE_SMALL_ID = "QnVzaW5lc3M6YWU4YTgxYjYtZWI4OS00MDRhLWExNzgtYzJmYmM4OTc2ODIzO1Byb2R1Y3Q6ODIzNzM4NzE="


function DonateForm(props: DonateFormProps) {
  const lang = props.lang || 'en';
  const [wizardStep, setWizardStep] = useState(0);
  const [email, setEmail] = useState("");
  const [fullName, setFullname] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressProvince, setAddressProvince]: [string | undefined, any] = useState(undefined);
  const [addressCountry, setAddressCountry] = useState("CA");
  const [addressCode, setAddressCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [memo, setMemo] = useState("");
  const [addNote, setAddNote] = useState(false);
  const [itemsSocks, setItemsSocks] = useState(1);
  const [itemsExtraBoots, setItemsExtraBoots] = useState(0);
  const [itemsTeeSmall, setItemsTeeSmall] = useState(0);
  const [itemsTeeMedium, setItemsTeeMedium] = useState(0);
  const [itemsTeeLarge, setItemsTeeLarge] = useState(0);
  const [loading, setLoading] = useState(false);

  const provinceOptions = COUNTRIES[addressCountry as keyof typeof COUNTRIES].provinces;

  const totalStep3 = 60 + itemsExtraBoots * 60 + itemsSocks * 20;
  const total = Math.round((totalStep3 + (itemsTeeSmall + itemsTeeMedium + itemsTeeLarge) * 39.99 + 10) * 100) / 100;

  const step1done = !!email && !!fullName;
  const step2done = step1done && !!addressLine1 && !!addressCity && !!addressCountry && !!addressProvince && !!addressCountry && !!phoneNumber;
  const step3done = step1done && step2done;
  const step4done = step3done;

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
          'countryCode': addressCountry,
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
          [TEE_SMALL_ID]: {
            'quantity': itemsTeeSmall,
            'unitPrice': 3999,
          },
          [TEE_MEDIUM_ID]: {
            'quantity': itemsTeeMedium,
            'unitPrice': 3999,
          },
          [TEE_LARGE_ID]: {
            'quantity': itemsTeeLarge,
            'unitPrice': 3999,
          },
          [DELIVERY_CANADA_PRODUCT_ID]: {
            'quantity': addressCountry === "CA" ? 1 : 0,
            'unitPrice': 1000,
          },
          [DELIVERY_OUTSIDE_CANADA_ID]: {
            'quantity': addressCountry === "CA" ? 0 : 1,
            'unitPrice': 2000,
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

  const clearSmallTees = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setItemsTeeSmall(0);
  }

  const clearMediumTees = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setItemsTeeMedium(0);
  }

  const clearLargeTees = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setItemsTeeLarge(0);
  }

  return (
    <form className="wizard sw-main sw-theme-default">
      <ul className="d-flex step-circles mb-5 justify-content-center nav nav-tabs step-anchor">
        <li className={wizardStep === 0 ? "nav-item active" : step1done ? "nav-item done" : "nav-item"}><button type="button" className="nav-link btn" onClick={() => setWizardStep(0)}>1</button>
        </li>
        <li className={wizardStep === 1 ? "nav-item active" : step2done ? "nav-item done" : "nav-item"}><button type="button" className="nav-link btn" onClick={() => step1done && setWizardStep(1)}>2</button>
        </li>
        <li className={wizardStep === 2 ? "nav-item active" : step3done ? "nav-item done" : "nav-item"}><button type="button" className="nav-link btn" onClick={() => step2done && setWizardStep(2)}>3</button>
        </li>
        <li className={wizardStep === 3 ? "nav-item active" : step3done ? "nav-item done" : "nav-item"}><button type="button" className="nav-link btn" onClick={() => step3done && setWizardStep(3)}>4</button>
        </li>
      </ul>
      <div className="sw-container tab-content">
        <div id="step-1" className={wizardStep === 0 ? "active tab-pane step-content" : "tab-pane step-content"}>

          <div className="row justify-content-around o-hidden o-lg-visible">
            {lang === 'uk' ? (
              <div className="col-xl-6 col-lg-6 col-md-6" data-aos="fade-left">
                <h3 className="h2">Реєстрація</h3>
                <p className="lead">
                  100% коштів від реєстрації на “#RunForUkraine - Give Boots to Defenders” будуть спрямовані на закупівлю зимового взуття для українських захисників.
                </p>
                <p className="lead">
                  Сума стартового внеску — <strong>60 канадських доларів</strong>, що дорівнює вартості однієї пари берців. Якщо ж хочеш допомогти нашим захисникам ще більше - додай у свій кошик ще берців та теплих шкарпеток.
                </p>
                <p className="lead">
                  Після оплати реєстрації в забігу/покупки взуття для захисників, тобі прийде електронний лист-підтвердження твоєї реєстрації. Наш благодійний онлайн-забіг не включає обовʼязкової перевірки подолання дистанції. Ми тобі довіряємо та не проводимо обліку результатів.
                </p>
                <p className="lead">
                  Кожен учасник забігу — наш власний герой! Кожен пробіг — це вклад в перемогу України! А тепер — нумо, бігти разом!
                </p>
              </div>
            ) : (
              <div className="col-xl-6 col-lg-6 col-md-6" data-aos="fade-left">
                <h3 className="h2">Registration</h3>
                <p className="lead">
                  100% of raised funds from the registrations to #RunForUkraine - Give Boots to  Defenders will be directed towards the purchasing of the winter military boots for Ukrainian defenders.

                </p>
                <p className="lead">
                  The starting registration fee is <strong>60 CAD</strong>, which is the exact amount needed for one pair of military boots made in Ukraine. If you wish to help Ukrainian defenders even more - add to your cart more boots and warm socks.
                </p>
                <p className="lead">
                  After the successful registration / purchase of the boots for defenders you will receive a confirmation email.
                </p>
                <p className="lead">
                  Our charity virtual run doesn’t include the necessary distance completion check. We trust you and don’t collect the runners’ data.

                </p>
                <p className="lead">
                  Every runner is our own hero!<br />
                  Every run is a contribution to the Victory of Ukraine!<br />
                  Now it’s time to RUN together!

                </p>
              </div>
            )}
            <div className="col-xl-5 col-md-6 mb-4 mb-md-0" data-aos="fade">
              <div className="form-group">
                <label htmlFor="register-name">{lang === 'uk' ? "Імʼя" : "Name"}</label>
                <input
                  type="text"
                  name="fullName"
                  id="register-name"
                  className="form-control form-control-lg"
                  value={fullName}
                  placeholder={lang === 'uk' ? "Напишіть Ваше ім'я" : "Type your name"}
                  onChange={(e) => setFullname(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="register-email">{lang === 'uk' ? "Адреса Електронної Пошти" : "Email"}</label>
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
              {step1done ? <button type="button" className="btn btn-primary-2 sw-btn-next" onClick={() => setWizardStep(1)} disabled={!step1done}>{lang === 'uk' ? "Далі" : "Next"}</button> : null}
            </div>
          </div>
        </div>
        <div id="step-2" className={wizardStep === 1 ? "active tab-pane step-content" : "tab-pane step-content"}>

          <div className="row justify-content-around o-hidden o-lg-visible">
            <div className="col-xl-6 col-lg-6 col-md-6" data-aos="fade-left">
              <p className="lead">
                {lang === 'uk' ? (
                  "Кожен з учасників, зареєстрованих в пробізі, отримає унікальну медаль на вказану адресу протягом 4 тижнів після реєстрації."
                ) : (
                  "Every registered runner will receive the unique medal to the address mentioned in this form within 4 weeks."
                )}
              </p>
              <img src="assets/photos/medal-front.png" alt="Image" className="rounded"></img>
            </div>
            <div className="col-xl-5 col-md-6 mb-4 mb-md-0" data-aos="fade">
              <div className="form-group">
                <label htmlFor="register-address-country">{lang === 'uk' ? "Поштові Деталі" : "Shipping Details"}</label>
                <select
                  className="custom-select"
                  id="register-address-country"
                  value={addressCountry}
                  placeholder={"Country"}
                  onChange={(e) => setAddressCountry(e.target.value)}
                >
                  {Object.entries(COUNTRIES as { [code: string]: { code: string, name: string } }).map(
                    ([key, country], i) => {
                      return <option selected={addressCountry === country.code} value={country.code}>{country.name}</option>;
                    })}
                </select>
                <img className="icon" src="assets/img/icons/interface/arrow-caret.svg" alt="arrow-caret interface icon" data-inject-svg />
              </div>
              <div className="form-group">
                <select
                  className="custom-select"
                  value={addressProvince}
                  placeholder={"Province"}
                  onChange={(e) => setAddressProvince(e.target.value)}
                >
                  {provinceOptions.map((province: { code: string, name: string }) => {
                    return <option selected={addressProvince === province.code} value={province.code}>{province.name}</option>;
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
                  placeholder={lang === 'uk' ? "Місто" : "City"}
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
                  placeholder={lang === 'uk' ? "Номер будинку і вулиця" : "Address line 1 (street and number)"}
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
                  placeholder={lang === 'uk' ? "Номер квартири (apt, suite, unit)" : "Address line 2 (apt, suite, unit)"}
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
                  placeholder={lang === 'uk' ? "Поштовий Код" : "Postal/Zip Code"}
                  onChange={(e) => setAddressCode(e.target.value)}
                />
              </div>
              <div className="form-group">
                <input
                  type="tel"
                  name="address-phone"
                  id="register-phone"
                  className="form-control"
                  value={phoneNumber}
                  placeholder={lang === 'uk' ? "Номер телефону" : "Phone number"}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              {step2done ? <button type="button" className="btn btn-primary-2 sw-btn-next" onClick={() => setWizardStep(2)} disabled={!step2done}>{lang === 'uk' ? "Далі" : "Next"}</button> : null}
            </div>
          </div>

        </div>
        <div id="step-3" className={wizardStep === 2 ? "active tab-pane step-content" : "tab-pane step-content"}>

          <div className="row justify-content-around o-hidden o-lg-visible">
            <div className="col-xl-4 col-lg-5 col-md-6" data-aos="fade-left">

              <img src="assets/products/boots-and-socks5.jpg" alt="Image" className="rounded"></img>
            </div>
            <div className="col-xl-6 col-md-6 mb-4 mb-md-0" data-aos="fade">

              <table className="table table-hover">
                <tbody>
                  <tr>
                    {lang === 'uk' ? (
                      <td>
                        <strong>Стартовий внесок</strong> - одна пара взуття для ЗСУ <br /> <small>Усі кошти від вашої реєстрації будуть спрямовані на закупівлю зимового взуття для українських захисників</small>
                      </td>
                    ) : (
                      <td>
                        <strong>Registration fee</strong> - one pair of boots for the Armed Forces of Ukraine <br /> <small>All proceeds will go to toward purchasing of the winter military boots for the Armed Forces of Ukraine!</small>
                      </td>
                    )}
                    <td>$60</td>
                  </tr>
                  <tr>
                    <td>
                      <div>
                        {lang === 'uk' ? (
                          <label htmlFor="register-socks">🥾 {itemsExtraBoots > 0 ? <><strong>Взуття</strong> для ЗСУ</> : <>Додати <strong>ще взуття</strong> для ЗСУ?</>} <br /><small>Одна пара військового взуття <a href="https://www.patriboots.com.ua/shop/otaman-khaki-nu/" target="_blank">PatriBoots Otaman</a> $60</small></label>
                        ) : (
                          <label htmlFor="register-socks">🥾 {itemsExtraBoots > 0 ? <><strong>Boots</strong> for the Armed Forces of Ukraine </> : <>Add <strong>more boots</strong> for the Armed Forces of Ukraine?</>} <br /><small>One pair of military boots <a href="https://www.patriboots.com.ua/shop/otaman-khaki-nu/" target="_blank">PatriBoots Otaman</a> is $60</small></label>
                        )}
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
                      {lang === 'uk' ? (
                        <p>🧦 {itemsSocks > 0 ? <><strong>Військові шкарпетки</strong> для ЗСУ</> : <>Додати <strong>військові шкарпетки</strong> для ЗСУ?</>} <br /><small>Виробник професійних військових шкарпеток <a href="https://covertthreads.com" target="_blank">Covert Threads (USA)</a> підтримує Україну і надає нам суттєву знижку (по собівартості). Одна пара якісних шкарпеток з доставкою $20</small></p>

                      ) : (
                        <p>🧦 {itemsSocks > 0 ? <><strong>Military socks</strong> for the Armed Forces of Ukraine</> : <>Add <strong>military socks</strong> for the Armed Forces of Ukraine?</>} <br /><small>Manufacturer of professional military socks <a href="https://covertthreads.com" target="_blank">Covert Threads (USA)</a> supports Ukraine and offered us considerable discount (at cost). A pair of quality socks with delivery is $20</small></p>
                      )}
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
                </tbody>
              </table>
              {addNote ? (
                <div className="form-group mt-2">
                  {lang === 'uk' ? (
                    <label htmlFor="register-memo">Коментар (<a href="#" onClick={handleAddNote}>та ні</a>)</label>
                  ) : (
                    <label htmlFor="register-memo">Comment (<a href="#" onClick={handleAddNote}>no</a>)</label>
                  )}
                  <textarea
                    name="memo"
                    id="register-memo"
                    className="form-control"
                    value={memo}
                    placeholder={lang === 'uk' ? "Залиште коментар для Другого Фронту (за бажанням)" : "Optionally, leave comment for Second Front"}
                    rows={7}
                    onChange={(e) => setMemo(e.target.value)}
                  />
                </div>
              ) : (
                <div className="mt-2">
                  <a href="#" onClick={handleAddNote}>{lang === 'uk' ? "Прикріпити коментар?" : "Leave comment?"}</a>
                </div>
              )}
              <div className="mt-4">
                <p className="lead"><strong>{lang === 'uk' ? "Усього на ЗСУ" : "Total for the Armed Forced of Ukraine"}: ${totalStep3}</strong><br /></p>
              </div>
              <div className="mt-3">
                <div>
                  {step3done ? <button type="button" className="btn btn-primary-2 sw-btn-next" onClick={() => setWizardStep(3)} disabled={!step3done}>{lang === 'uk' ? "Далі" : "Next"}</button> : null}
                </div>
                <div className="text-center">
                  <p><small>{lang === 'uk' ? "Усі ціни вказані в Канадських Доларах (CAD)" : "All prices are listed in Canadian Dollars (CAD)"}</small></p>
                </div>
              </div>
            </div>
          </div>


        </div>
        <div id="step-4" className={wizardStep === 3 ? "active tab-pane step-content" : "tab-pane step-content"}>
          <div className="row justify-content-around o-hidden o-lg-visible">
            <div className="col-xl-4 col-lg-5 col-md-6" data-aos="fade-left">
              <div className="card card-icon-3 hover-shadow-3d rotate-right">
                <img src="assets/products/tee-promo.jpg" alt="Run for Ukraine t-shirt" className="card-img-top"></img>

                <div className="card-body justify-content-between">
                  <h3>{lang === 'uk' ? "+ Футболка Run for Ukraine Унісекс за $39.99" : "+ Run for Ukraine Unisex Tee for $39.99"}</h3>
                  <div className="mb-2 d-block text-center">
                    <button type="button" className="m-1 btn btn-sm btn-primary-2" onClick={() => setItemsTeeSmall(itemsTeeSmall + 1)}>+ S</button>
                    <button type="button" className="m-1 btn btn-sm btn-primary-2" onClick={() => setItemsTeeMedium(itemsTeeMedium + 1)}>+ M</button>
                    <button type="button" className="m-1 btn btn-sm btn-primary-2" onClick={() => setItemsTeeLarge(itemsTeeLarge + 1)}>+ L</button>
                  </div>
                  {lang === 'uk' ? (
                    <p className="">
                      Добавте знакову футболку <em>#RunForUkraine</em>
                      <ul>
                        <li><a href="https://shop.secondfrontukraine.com" target="_blank">Офіційний мерчандайз від Second Front</a></li>
                        <li>100% Поліестер</li>
                        <li>Дизайн Антона Маслова</li>
                        <li>Колір: жовтий</li>
                        <li>Кошти зібрані за футболки направлені на потреби ЗСУ (звіт закупівель та відправок можна знайти на <a href="https://secondfrontukraine.com">secondfrontukraine.com</a>)</li>
                      </ul>
                    </p>
                  ) : (
                    <p className="">
                      Opt in for an iconic <em>#RunForUkraine</em> t-shirt
                      <ul>
                        <li><a href="https://shop.secondfrontukraine.com" target="_blank">Official Second Front Merch</a></li>
                        <li>100% Polyester</li>
                        <li>Design by Anton Masalov</li>
                        <li>Color: yellow</li>
                        <li>T-Shirt profits directed towards needs of Ukrainian defenders (you'll find our past report on <a href="https://secondfrontukraine.com">secondfrontukraine.com</a>)</li>
                      </ul>
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-md-6 mb-4 mb-md-0" data-aos="fade">
              <h3 className="h3">{lang === 'uk' ? "Підсумок реєстрації" : "Registration summary"}</h3>
              <table className="table table-hover">
                <tbody>
                  <tr>
                    {lang === 'uk' ? (
                      <td>
                        <p>🥾 <strong>Стартовий внесок</strong> - пара взуття
                          <br /> <em>(Для ЗСУ)</em></p>
                      </td>
                    ) : (
                      <td>
                        <p>🥾 <strong>Registration fee</strong> - a pair of boots
                          <br /> <em>(for the Armed Forced of Ukraine)</em></p>
                      </td>
                    )}
                    <td>$60</td>
                  </tr>
                  {itemsExtraBoots > 0 ? (
                    <tr>
                      {lang === 'uk' ? (
                        <td>
                          <p>
                            🥾 <strong>Військове взуття</strong>
                            <br /> <em>(Для ЗСУ)</em>
                          </p>
                        </td>
                      ) : (
                        <td>
                          <p>
                            🥾 <strong>Military boots</strong>
                            <br /> <em>(for the Armed Forced of Ukraine)</em>
                          </p>
                        </td>
                      )}
                      <td>${itemsExtraBoots * 60}</td>
                    </tr>
                  ) : null}
                  {itemsSocks > 0 ? (
                    <tr>
                      {lang === 'uk' ? (
                        <td>
                          <p>🧦 <strong>Військові шкарпетки</strong>
                            <br /> <em>(Для ЗСУ)</em>
                          </p>
                        </td>
                      ) : (
                        <td>
                          <p>🧦 <strong>Military socks</strong>
                            <br /> <em>(for the Armed Forced of Ukraine)</em>
                          </p>
                        </td>
                      )}
                      <td>{itemsSocks > 0 ? `$${itemsSocks * 20}` : ""}</td>
                    </tr>
                  ) : null}

                  {itemsTeeSmall > 0 ? (
                    <tr>
                      {lang === 'uk' ? (
                        <td>
                          <p>
                            👕 <strong>Бігова футболка</strong> #RunForUkraine (Small) {itemsTeeSmall > 1 ? `x${itemsTeeSmall}` : ""}
                            <br /> <em>(Для Вас)</em>
                            <br /> <small><a href="#" onClick={clearSmallTees}>Скасувати</a></small>
                          </p>
                        </td>
                      ) : (
                        <td>
                          <p>
                            👕 <strong>T-Shirt</strong> #RunForUkraine (Small) {itemsTeeSmall > 1 ? `x${itemsTeeSmall}` : ""}
                            <br /> <em>(For you)</em>
                            <br /> <small><a href="#" onClick={clearSmallTees}>Remove</a></small>
                          </p>
                        </td>
                      )}
                      <td>${itemsTeeSmall * 39.99}</td>
                    </tr>
                  ) : null}
                  {itemsTeeMedium > 0 ? (
                    <tr>
                      {lang === 'uk' ? (
                        <td>
                          <p>
                            👕 <strong>Бігова футболка</strong> #RunForUkraine (Medium) {itemsTeeMedium > 1 ? `x${itemsTeeMedium}` : ""}
                            <br /> <em>(Для Вас)</em>
                            <br /> <small><a href="#" onClick={clearMediumTees}>Скасувати</a></small>
                          </p>
                        </td>
                      ) : (
                        <td>
                          <p>
                            👕 <strong>T-Shirt</strong> #RunForUkraine (Medium) {itemsTeeMedium > 1 ? `x${itemsTeeMedium}` : ""}
                            <br /> <em>(For you)</em>
                            <br /> <small><a href="#" onClick={clearMediumTees}>Remove</a></small>
                          </p>
                        </td>
                      )}
                      <td>
                        ${itemsTeeMedium * 39.99}
                      </td>
                    </tr>
                  ) : null}
                  {itemsTeeLarge > 0 ? (
                    <tr>
                      {lang === 'uk' ? (
                        <td>
                          <p>
                            👕 <strong>Бігова футболка</strong> #RunForUkraine (Large) {itemsTeeLarge > 1 ? `x${itemsTeeLarge}` : ""}
                            <br /> <em>(Для Вас)</em>
                            <br /> <small><a href="#" onClick={clearLargeTees}>Скасувати</a></small>
                          </p>
                        </td>
                      ) : (
                        <td>
                          <p>
                            👕 <strong>T-Shirt</strong> #RunForUkraine (Large) {itemsTeeLarge > 1 ? `x${itemsTeeLarge}` : ""}
                            <br /> <em>(For you)</em>
                            <br /> <small><a href="#" onClick={clearLargeTees}>Remove</a></small>
                          </p>
                        </td>
                      )}
                      <td>${itemsTeeLarge * 39.99}</td>
                    </tr>
                  ) : null}
                  {addressCountry === "CA" ? (
                    <tr>
                      {lang === 'uk' ? (
                        <td>🚚 <strong>Доставка</strong> <br /> <em>(Канада)</em></td>
                      ) : (
                        <td>🚚 <strong>Delivery</strong> <br /> <em>(Canada)</em></td>
                      )}
                      <td>$10</td>
                    </tr>
                  ) : (
                    <tr>
                      {lang === 'uk' ? (
                        <td>🚚 <strong>Доставка</strong> <br /> <em>({addressCountry})</em></td>
                      ) : (
                        <td>🚚 <strong>Delivery</strong> <br /> <em>({addressCountry})</em></td>
                      )}
                      <td>$20</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="mt-4">
                <p className="lead"><strong>{lang === 'uk' ? "Усього до оплати" : "Total"}: ${total}</strong><br /></p>
              </div>


              <div className="mt-3">
                <div className='form-group text-center'>
                  <button type="button" onClick={handleSubmit} className="btn btn-lg btn-primary btn-block mb-2" disabled={loading}>{lang === 'uk' ? "Завершити реєстрацію" : "Complete registration"}</button>
                </div>
                <div className="invoice-insights__payments-banner">
                  <div className="icon-override wv-icon--payment-method--small wv-icon--payment-method--bank-payment"></div>
                  <div className="icon-override wv-icon--payment-method--small wv-icon--payment-method--cc-amex"></div>
                  <div className="icon-override wv-icon--payment-method--small wv-icon--payment-method--cc-mastercard"></div>
                  <div className="icon-override wv-icon--payment-method--small wv-icon--payment-method--cc-visa"></div>
                </div>
                <div className="text-center">
                  <p><small>{lang === 'uk' ? "Усі ціни вказані в Канадських Доларах (CAD)" : "All prices listed in Canadian Dollars (CAD)"}</small></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </form>
  );
}

export default DonateForm;
