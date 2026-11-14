import { cleanJalaliDate } from "@/core/helper/dateConverter";

import { useGetActiveUserSerialsQuery } from "@/features/Services/reducers/endpoints";
import { message } from "antd";

import moment from 'moment-jalaali';
import { useCallback, useEffect, useRef, useState } from "react"
import type { Value, DateObject } from "react-multi-date-picker";
import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from "../reducers/filterSlice";

interface IHooksProps {

    handlePageChange?: (page: number, pageSize: number) => void
    pageNumber?: number
    pageSize?: number
    totalPages?: number
}

export default function useSentLinksDetailsHooks({ handlePageChange, pageNumber, totalPages, pageSize }: IHooksProps) {
    const filters = useSelector((state: any) => state?.sendLinksfilters);
    const { data: usersSerialsList, isLoading: userListLoading } = useGetActiveUserSerialsQuery()
    const [dates, setDates] = useState<Value[] | undefined>(undefined);
    const [selectedFromDate, setSelectedFromDate] = useState("")
    const [selectedToDate, setSelectedToDate] = useState("")
    const [showMobileFilter, setShowMobileFlters] = useState(false)
    const [showMobileDetails, setShowMobileDetails] = useState(false)
    const [isCollapsed, setIsCollapsed] = useState(false);

    const [searchValue, setSearchValue] = useState(filters?.search||"");
    const loadingRef = useRef(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Clear the previous timer if the user types again
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        // Only start a new timer if the searchValue is longer than 1 character
        if (searchValue?.length > 1) {
            timerRef.current = setTimeout(() => {
                dispatch(setFilters({ search: searchValue }));
            }, 2000); // 3 seconds
        }

        else if (searchValue === "") {
            dispatch(setFilters({ search: "" }));
        }
        // Cleanup when the component unmounts or before the next effect
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef?.current);
            }
        };
    }, [searchValue]);

  
    const handleCopy = useCallback(async (link: string) => {
        try {
            await navigator.clipboard?.writeText(link ?? "");
            message.success("کپی شد!");
        } catch (err) {
            console.error("Copy failed", err);
            message.error("خطا در کپی");
        }
    }, []);
    const dispatch = useDispatch();
    const handleChange = (selectedDates: Value[] | undefined) => {
        setDates(selectedDates);

        if (selectedDates && selectedDates.length === 2) {
            const [start, end] = selectedDates as DateObject[];
            const startJalali = start.format("YYYY/MM/DD");
            const endJalali = end.format("YYYY/MM/DD");

            const fromDateEN = moment(cleanJalaliDate(startJalali), 'jYYYY/jMM/jDD').format('YYYY/MM/DD');
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
        filters,
        handleCloseMobileDetailsModal,
        showMobileDetails,
        setShowMobileDetails,
        isCollapsed,
        setIsCollapsed,
        handleCopy,
        setSearchValue,
        searchValue,
        weekDays

    }
}
