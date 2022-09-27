import React, { useState, useEffect, useRef } from 'react';
import internal from 'stream';
import DonateForm from './DonateForm';
import { wave } from '../axiosInstances';

export interface WidgetProps {
    campaign: string;
}

interface Campaign {
    slug: string,
    collected: number,
}

interface Tab {
    url: string,
    tab_id: string,
    paid: boolean,
}

function Widget(props: WidgetProps) {
    const [campaignData, setCampaignData] = useState({
        slug: props.campaign,
        collected: 0
    } as Campaign);
    const [tab, setTab] = useState(undefined as Tab | undefined);
    const breakPoll = useRef(false);

    const openPaymentForm = (tabToOpen: Tab) => {
        window.open(tabToOpen.url, "", "width=1024, height=768");
    }

    const pollForPayment = (tabAsArgument?: Tab, counter = 1) => {
        wave.get(`/tab/${tabAsArgument?.tab_id}`).then(result => {
            if (!result.data.paid && counter <= 120) {
                if (!breakPoll.current) {
                    setTimeout(() => pollForPayment(tabAsArgument, counter + 1), 5000);
                } else {
                    breakPoll.current = false;
                }
            } else {
                setTab(result.data);
                fetchCampaign();
            }
        });
    }

    const onTabCreated = (tab: Tab) => {
        setTab(tab);
        localStorage.setItem(`tab-in-progress-${props.campaign}`, JSON.stringify(tab));
        openPaymentForm(tab);
        pollForPayment(tab);
    }

    const handleDonationCancel = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setTab(undefined);
        breakPoll.current = true;
    }

    const fetchCampaign = () => {
        wave.get(`/campaign/${props.campaign}`).then((result) => {
            setCampaignData(result.data.campaign);
        });
    }

    useEffect(() => {
        // Load Campaign details
        fetchCampaign();

        // Check local storage for existing donation Tab
        const items = localStorage.getItem(`tab-in-progress-${props.campaign}`);
        if (items) {
            const parsedTab: Tab = JSON.parse(items)
            setTab(parsedTab);
            pollForPayment(parsedTab);
        }
    }, [])

    const handleClickDonation = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (tab) {
            openPaymentForm(tab);
        }
    }

    return (
        <div className="sfua-widget">
            {tab ? tab.paid ? (
                <div className="text-center">
                    <p className="lead">Дякуємо за Вашу реєстрацію!</p>
                    <p className="lead">💙&nbsp;💛</p>
                    <h2>Погнали!</h2>
                    <ol className="process-vertical">
                        <li>
                            <div className="process-circle bg-primary"></div>
                            <div>
                            <span className="text-small text-muted">1 Жовтня</span>
                            <h5 className="mb-0">Початок забігу. Передаєм нашим що ми ПОГНАЛИ! (можна тегнути <a href="https://www.instagram.com/secondfrontua/">@secondfrontua</a> та <code>#RunForUkraine</code>)</h5>
                            </div>
                        </li>
                        <li>
                            <div className="process-circle bg-primary"></div>
                            <div>
                            <span className="text-small text-muted">Десь у Жовтні</span>
                            <h5 className="mb-0">Бігаємо вибрану дистанцію</h5>
                            </div>
                        </li>
                        <li>
                            <div className="process-circle bg-primary"></div>
                            <div>
                            <span className="text-small text-muted">Десь після бігу</span>
                            <h5 className="mb-0">Виклажаємо фоточки в соцмережі, не забуваємо тегнути <a href="https://www.instagram.com/secondfrontua/">@secondfrontua</a> та <code>#RunForUkraine</code></h5>
                            </div>
                        </li>
                        <li>
                            <div className="process-circle bg-primary"></div>
                            <div>
                            <span className="text-small text-muted">31 Жовтня</span>
                            <h5 className="mb-0">Фінішуємо, поки ми рахуємо і замовляємо берци і шкарпетки</h5>
                            </div>
                        </li>
                        <li>
                            <div className="process-circle bg-primary-2"></div>
                            <div>
                            <span className="text-small text-muted">Листопад</span>
                            <h5 className="mb-0">Ми висилаємо захисникам тепле взуття і шкарпетки. Перемога не за горами!</h5>
                            </div>
                        </li>
                    </ol>
                </div>
            ) : (
                <div className="text-center">
                    <p className="lead">Очікується <a href="#" onClick={handleClickDonation}>платіж</a> у новому вікні браузера.<br/> <em>Якщо нове віконце автоматично не відкрилося, натисніть ґудзик "Оплатити"</em>.
                    </p>
                    <a href="#" className="m-1 btn btn-light" onClick={handleClickDonation}>Оплатити</a>
                    <a href="#" className="m-1 btn btn-sm btn-light" onClick={handleDonationCancel}>Скасувати</a>
                </div>
            ) : (
                <div>
                    <DonateForm campaign={props.campaign} onTabCreated={onTabCreated} />
                </div>
            )}
        </div>
    );
}

export default Widget;
