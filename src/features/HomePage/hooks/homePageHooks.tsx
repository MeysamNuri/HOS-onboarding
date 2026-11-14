
import sendInvoice from '@core/assets/images/send-invoice-card.png'
import AICard from '@core/assets/images/AI-card.png'
import BICard from '@core/assets/images/BI-card.png'
import { useEffect, useState } from 'react'
import json from '@core/constants/config.json'
import { useSelector } from 'react-redux'
import type { RootState } from "@core/constants/store";
import { Grid } from 'antd'
import useSimplePackageActivation from '@/core/components/hooks/useSimplePackageActivation'
import useSimpleServicePacket from '@/core/components/hooks/useSimpleServicePacket'




export default function useHomePageHooks() { 
  const [cardPath, setCardPath] = useState("")
  const authToken = localStorage.getItem("authToken")
  const [openModal, setOpenModal] = useState(false)
  const catalog = useSimpleServicePacket(cardPath === "BI" ? "BI" : "SendInvoice", openModal && (cardPath === "BI" || cardPath === "sendLink"))
  const selectedPlan = catalog.selectedPlan
  const hamrahActivation = useSimplePackageActivation(selectedPlan, cardPath === "BI" ? "BI" : "SendInvoice")
  const openModalStorage = localStorage.getItem("openModalStorage")
 const userInfo = useSelector(
    (state: RootState) => state.userInfo.value
  );
const BACK_URL = json.backUrl;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const isDesktop = screens.lg;
  const handleOpenModal = (cardLink: string) => {
    const serviceCode = cardLink === "holoo-hamrah" ? "BI" : cardLink
    localStorage.setItem("openModalStorage", "activationModal")
    localStorage.setItem("serviceCode", serviceCode)
    if (serviceCode === "BI") sessionStorage.setItem("activationPage", window.location.pathname)
    if (!authToken) {
      window.location.href = `https://portfolio.invalid/sso/authorize?client_id=portfolio-demo&response_type=code&redirect_uri=${BACK_URL}/home&scope=openid%20profile%20persona:read&state=home`;
      return;
    }
    setCardPath(serviceCode)
    setOpenModal(true)

  }
 useEffect(() => {

    if (userInfo) {
     
    if (openModalStorage === "activationModal") {
        setCardPath(localStorage.getItem("serviceCode") ?? "")
        setOpenModal(true)
      }
    }

  }, [userInfo])
   
    const cards = [
        {
            title: "هلو همراه",
            description:
              "در هر جای دنیا که هستید، داشبورد آخرین وضعیت کسب و کارتان را روی گوشی موبایل مشاهده کنید .",
            icon: <img src={BICard} />,
            link: "holoo-hamrah",
            active: true
        },
        {
            title: "اشتراک آنلاین اسناد ",
            description:
              "با یک کلیک، لینک مشاهده آنلاین انواع فاکتور/پیش فاکتور و گزارش معین اشخاص را به گوشی مشتری ارسال کنید.",

            link: "sendLink",
            icon: <img src={sendInvoice} />,
            active: true
        },
        {
            title: "دستیار تحلیل هلو ",
            description:
                "هلودستیار، کمک میکند بفهمید در کسب و کارتان چه خبراست و چه باید کرد .",

            link: "AI",
            icon: <img src={AICard} />,
            active: false
        },
    ];

  useEffect(() => {
    if (openModal && selectedPlan) localStorage.setItem("packetCode", selectedPlan.code)
  }, [openModal, selectedPlan])

  const handleCloseModal = () => {
    setOpenModal(false)
    localStorage.removeItem("openModalStorage")

  }

    return {
        cards,
        handleOpenModal,
        cardPath,
        hamrahActivation,
        catalog,
        selectedPlan,
        handleCloseModal,
        openModal,
        isDesktop


    }
}
