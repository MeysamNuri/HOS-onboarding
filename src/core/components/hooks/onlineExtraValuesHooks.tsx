import type { CollapseProps } from "antd";
import { Form, Grid } from "antd";
import { useEffect, useMemo, useState } from "react";


import type { RootState } from "@core/constants/store";
import { useSelector } from "react-redux";
import { useLocation, useSearchParams } from 'react-router'
import json from '@core/constants/config.json'
import { useGetServicePacketQuery } from "@/core/api/baseApi";


const BACK_URL = json.backUrl;

export default function useOnlineExtraValuesHooks() {
  const location = useLocation()
  const [searchParams] = useSearchParams();
  const path = location.pathname.split("/")[1]
  const [settingsForm] = Form.useForm();
  const agentCode = searchParams.get("agentcode");
  const [openInvoiceDemo, setOpenInvoiceDemo] = useState(false)

  const serviceCode = path === "sendLink" ? "SendInvoice" : path

  const authToken = localStorage.getItem("authToken")
  const packageFilters = useSelector(
    (state: RootState) => state.packageFilters
  );
  const { data: packetData, isFetching: packetDataLoading } = useGetServicePacketQuery({
    serviceCode,
    agentCode: agentCode!,
    discountCode: null,
    type: packageFilters?.type,
    category: packageFilters?.category
  })

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const isDesktop = screens.lg;
  const openModalStorage = localStorage.getItem("openModalStorage")
  const userInfo = useSelector(
    (state: RootState) => state.userInfo.value
  );

  /* ================= Static UI data ================= */
  const BIFAQ: CollapseProps["items"] = useMemo(
    () => [
      {
        key: "1",
        label: " هلو همراه چگونه به کسب کار من کمک میکند؟",
        children: (
          <p>
            با کمک دشبورد ها و شاخص های محاسبه شده بر اساس آخرین وضعیت دیتای ثبت شده در نرم افزار حسابداری هلو ، می توانید آنلاین و در هر جای دنیا از آخرین وضعیت کسب و کارتان آگاه شود .
          </p>
        ),
      },
      {
        key: "2",
        label: "چطور از هلو همراه استفاده کنم ؟ ",
        children: <p>از قسمت خرید بسته(لینک) ، پکیج مد نظرتان را خریداری کنید و با کمک راهنمای فعالسازی(لینک) موبایل اپلیکیشن هلو همراهرا دریافت و نصب کنید . از امکانات برنامه لذت ببرید ! </p>,
      },
      {
        key: "3",
        label: "چطور از اتفاقات خاص کسب و کارم آگاه شوم ؟ ",
        children: <p>اگر فرصت ندارید لازم نیست دشبورد را دائما چک کنید ! هنگام بروز اتفاقاتی مثل "کسری موجودی برای پاس شدن چک ها" ، "رشد فروش" و...  روی گوشی موبایل شما نوتیفیکیشن ارسال می کنیم . </p>,
      },
      {
        key: "4",
        label: "می توانم از امنیت اطلاعات کسب و کار مطمئن باشم ؟",
        children: <p>کاملا ! دشبورد های ویژه کسب و کار شما مبتنی بر اطلاعات رمز نگاری شده ی ثبت شده در نرم افزار حسابداری هلو ، فقط در گوشی موبایل شما و با ارسال کد تایید پیامکی به شماره موبایل خودتان در دسترس شما قرار می گیرد . </p>,
      },
    ],
    []
  );
  const onlineInvoiceFAQ: CollapseProps["items"] = useMemo(
    () => [
      {
        key: "1",
        label: "اشتراک آنلاین اسناد چه کمکی به من می کند ؟ ",
        children: (
          <p>
            بعد از ثبت فاکتور در نرم افزار حسابداری هلو ، با زدن دکمه ارسال آنلاین ، لینک مشاهده فاکتور برای مشتری ثبت شده در فاکتور پیامک می شود .
            مشتری با کلیک روی لینک می تواند به صورت آنلاین اطلاعات فاکتور خود را روی گوشی موبایل مشاهده نماید و در صورت تمایل لینک را با دوستان و همکاران خود به اشتراک گزارد .

          </p>
        ),
      },
      {
        key: "2",
        label: "امکان ارسال اطلاعات واریز به مشتری وجود دارد ؟ ",
        children: <p>بله ! شما می تواند با تعیین متن زیر نویس اطلاعاتی مثل شماره کارت جهت واریز وجه ، لینک صفحه اینستاگرام و... را در فرم آنلاین نمایش فاکتور و نسخه چاپی قابل دانلود  با مشتری به اشتراک بگزارید . </p>
      },
      {
        key: "3",
        label: "امکان تبلیغات فروشگاه وجود دارد ؟ ",
        children: <p>بله ! شما می توانید با تعیین شعار تبلیغاتی ، متن مورد نظر خود را در فرم آنلاین نمایش فاکتور و نسخه چاپی قابل دانلود به مشتری نمایش دهید . </p>
      },
      {
        key: "4",
        label: "لینک ارسال فاکتور چطور برای مشتری ارسال می شود  ؟ ",
        children: <p>لینک از طریق پیامک با عنوان درستیار هوشمند فروشگاه شما برای مشتری ارسال می شود .</p>
      },
      {
        key: "5",
        label: "مشتری فاکتور را به چه صورتی مشاهده می کند؟ ",
        children: <p>مشتری می تواند با کلیک روی لینک دریافت شده از طریق پیامک ، فرم آنلاین فاکتور را در گوشی موبایل یا هر مرور گر اینترنتی دیگر مشاهده نماید . </p>
      },
    ],
    []
  );





  /* ================= Load server data ================= */


  const handleOpenInvoiceModal = async () => {
    localStorage.setItem("openModalStorage", "invoiceModal")
    if (!authToken) {
      window.location.href = `https://portfolio.invalid/sso/authorize?client_id=portfolio-demo&response_type=code&redirect_uri=${BACK_URL}/home&scope=openid%20profile%20persona:read&state=home`;
      return;
    }
    // if (authToken) {
    //   await getSamplInvice()
    // }
    
    setOpenInvoiceDemo(true)
  }


  const handleCloseInvoiceDemo = () => {
    setOpenInvoiceDemo(false)
    localStorage.removeItem("openModalStorage")

  }





  useEffect(() => {

    if (userInfo) {
      if (openModalStorage === "invoiceModal") {
        setOpenInvoiceDemo(true)
      }

    }

  }, [userInfo])


  return {
    BIFAQ,
    path,
    onlineInvoiceFAQ,
    settingsForm,
    agentCode,
    packetDataLoading,
    packetData,
    isDesktop,
    handleCloseInvoiceDemo,
    handleOpenInvoiceModal,
    openInvoiceDemo

  };
}
