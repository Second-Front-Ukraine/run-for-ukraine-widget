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
                    <small><a href="#" className="m-1 btn btn-sm btn-light" onClick={handleDonationCancel}>Нова реєстрація</a></small>
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
