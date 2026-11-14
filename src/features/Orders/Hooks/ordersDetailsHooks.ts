import { cleanJalaliDate } from "@/core/helper/dateConverter";
import { useGetActiveUserSerialsQuery } from "@/features/Services/reducers/endpoints";

import moment from 'moment-jalaali';
import { useEffect, useRef, useState } from "react"
import type { Value, DateObject } from "react-multi-date-picker";
import { useDispatch } from 'react-redux';

import type { IOrersHstoryItems } from "../types";

interface IHooksProps {

    handlePageChange?: (page: number, pageSize: number) => void
    pageNumber?: number
    pageSize?: number
    totalPages?: number
}
export default function useOrderDetailsHooks({ handlePageChange, pageNumber, totalPages, pageSize }: IHooksProps) {
    const { data: usersSerialsList, isLoading: userListLoading } = useGetActiveUserSerialsQuery()
    const [dates, setDates] = useState<Value[] | undefined>(undefined);
    const [selectedFromDate, setSelectedFromDate] = useState("")
    const [selectedToDate, setSelectedToDate] = useState("")
    const [showMobileFilter, setShowMobileFlters] = useState(false)
    const [showMobileDetails, setShowMobileDetails] = useState(false)
    const [selectedItemDetails, setSelectedItemDetails] = useState<any>()
    const [serial, setSerial] = useState(() => localStorage.getItem("serial") || "")
    const loadingRef = useRef(false);

    useEffect(() => {
        const updateSerial = () => {
            setSerial(localStorage.getItem("serial") || "");
        };

        window.addEventListener("storage", updateSerial);
        window.addEventListener("serialChanged", updateSerial);

        return () => {
            window.removeEventListener("storage", updateSerial);
            window.removeEventListener("serialChanged", updateSerial);
        };
    }, []);

    const dispatch = useDispatch();
    const handleChange = (selectedDates: Value[] | undefined) => {
        setDates(selectedDates);

        if (selectedDates && selectedDates.length === 2) {
            const [start, end] = selectedDates as DateObject[];
            const startJalali = start.format("YYYY/MM/DD");
            const endJalali = end.format("YYYY/MM/DD");

            const fromDateEN = moment(cleanJalaliDate(startJalali), 'jYYYY/jMM/jDD').format('YYYY/MM/DD');
            ;
            const toDateEN = moment(cleanJalaliDate(endJalali), 'jYYYY/jMM/jDD').format('YYYY/MM/DD');

            setSelectedFromDate(fromDateEN)
            setSelectedToDate(toDateEN)

        }
    }

    const handleCloseMobileFilter = () => {
        setShowMobileFlters(false)
    }
    const handleCloseMobileDetailsModal = () => {
        setShowMobileDetails(false)
    }
    const handleSelectedIHistoryItem = (_: any, value: IOrersHstoryItems) => {
        if (value?.status === "PaymentFailed") return window.location.href = value?.link

        setSelectedItemDetails(value)
        setShowMobileDetails(true)
    }

    const weekDays = [
        ["شنبه", "شنبه"],
        ["یکشنبه", "یکشنبه"],
        ["دوشنبه", "دوشنبه"],
        ["سه‌شنبه", "سه‌شنبه"],
        ["چهارشنبه", "چهارشنبه"],
        ["پنجشنبه", "پنجشنبه"],
        ["جمعه", "جمعه"],
    ];

  useEffect(() => {
    const content = document.querySelector(
        ".app-layout__content"
    );

    if (!content) return;

    const handleScroll = () => {
        if (loadingRef.current) return;

        const element = content as HTMLElement;

        const currentPage = pageNumber ?? 1;
        const currentPageSize = pageSize ?? 10;
        const currentTotalPages = totalPages ?? 0;

        const scrollPosition =
            element.scrollTop + element.clientHeight;

        const threshold =
            element.scrollHeight - 400;

        if (scrollPosition >= threshold) {
            if (currentPage < currentTotalPages) {
                loadingRef.current = true;

                handlePageChange?.(
                    currentPage + 1,
                    currentPageSize
                );

                setTimeout(() => {
                    loadingRef.current = false;
                }, 500);
            }
        }
    };

    content.addEventListener("scroll", handleScroll);

    return () => {
        content.removeEventListener("scroll", handleScroll);
    };
}, [
    pageNumber,
    pageSize,
    totalPages,
    handlePageChange,
]);

    return {
        showMobileFilter,
        setShowMobileFlters,
        handleCloseMobileFilter,
        handleChange,
        dates,
        usersSerialsList,
        selectedFromDate,
        selectedToDate,
        userListLoading,
        setSelectedToDate,
        setSelectedFromDate,
        setDates,
        dispatch,
        weekDays,
        handleCloseMobileDetailsModal,
        showMobileDetails,
        setShowMobileDetails,
        handleSelectedIHistoryItem,
        selectedItemDetails,
        serial
    }
}
