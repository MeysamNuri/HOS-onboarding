import { Grid } from 'antd';
import share from '@core/assets/icons/features/share.svg'
import packages from '@core/assets/icons/support-icons/packages-status.svg'
import buy from '@core/assets/icons/support-icons/buy-packages.svg'
import guide from '@core/assets/icons/support-icons/guide.svg'
import quick from '@core/assets/icons/support-icons/quick-access.svg'
import settings from '@core/assets/icons/support-icons/settings.svg'
import { useNavigate } from "react-router"
export default function useSupportHooks() {
    const navigate = useNavigate()
    const { useBreakpoint } = Grid;

    const screens = useBreakpoint();

    const isDesktop = screens.lg;
    const quickAccessList = [
             {
            title: "راهنمای استفاده ",
            link: "/sendLink-help",
            icon: guide
        },
           {
            title: "تنظیمات ",
            link: "/settings",
            icon: settings
        },
        {
            title: "وضعیت بسته ها",
            link: "/active-services",
            icon: packages
        },
        {
            title: " تمدید سریع",
            link: "/quickrenew?packetcode=OneMonth500-3",
            icon: quick
        },
        {
            title: "مشاهده و خرید بسته ",
            link: "/sendLink",
            icon: buy
        },
   
     
        {
            title: "گزارش ارسال ها ",
            link: "/sent-links",
            icon: share
        },
    ]

    const handleQuickNavigate = (link: string) => {
        navigate(link)
    }
    return {
        isDesktop,
        quickAccessList,
        handleQuickNavigate
    }
}