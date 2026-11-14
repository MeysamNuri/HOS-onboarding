import { useProposedPackageMutation } from '@/core/api/baseApi';
import type { IProposePackage } from '@/core/types/models';
import json from '@core/constants/config.json'
import type { FormInstance } from 'antd';
import { useEffect, useState } from 'react';
import { toast } from "react-hot-toast";
import { useSelector } from 'react-redux';
import type { RootState } from "@core/constants/store";

export default function useSuggestedPackageHook({ path, form }: { path: string, form: FormInstance<any> }) {
    const isLogin = !!localStorage.getItem("authToken")
    const BACK_URL = json.backUrl;

    const ServiceCode = path === "sendLink" ? "SendInvoice" : path
    const [selectedSerialByUser, setSelectedSerialByUser] = useState(() =>
        localStorage.getItem("serial") || ""
    );
    const [submitPrposedPackage, { isLoading }] = useProposedPackageMutation()
    const userSerial = useSelector(
        (state: RootState) => state.insertedSerial
    );
    useEffect(() => {
        if (userSerial?.inserteSerial) {
            setSelectedSerialByUser(userSerial.inserteSerial);
        }
    }, [userSerial]);

    const serial = selectedSerialByUser;
    const handlesuggestedPackageOnfinish = async (values: {
        SendCount: number,
        MonthCount: number,
        FieldOfActivity: string,
        Mobile: string,
        Description: string
    }) => {

        if (!isLogin) {
            window.location.replace(`https://portfolio.invalid/sso/authorize?client_id=portfolio-demo&response_type=code&redirect_uri=${BACK_URL}/home&scope=openid%20profile%20persona:read&state=sendLink`)
            return;
        }
        const packageOBJ: IProposePackage = {
            SendCount: values?.SendCount,
            MonthCount: values?.MonthCount,
            FieldOfActivity: values?.FieldOfActivity,
            Mobile: values?.Mobile,
            Serial: serial ?? "",
            Description: values?.Description,
            ServiceCode
        }
        const response = await submitPrposedPackage(packageOBJ)
        if (response.data?.Data?.isSuccess) {
            toast.success("بسته پشنهادی با موفقیت ثبت شد")
            form.resetFields()
        }
    }
    return {
        handlesuggestedPackageOnfinish,
        isLoading
    }

}
