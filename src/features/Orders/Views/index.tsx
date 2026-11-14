import { Row, Col } from "antd";
import DesktopOrdersTable from "../Components/desktopOrdersTable";
import "./styles.scss"
import useOrdersHooks from "../Hooks/ordersHoosk";
import MobileOrdersCard from "../Components/mobileOrders";

import PagesHeader from "@/core/components/pagesHeader";


export default function Orders() {
    const { isDesktop,
        isFetching,
        ordersHistoryData,
        pageModel,
        handlePageChange,
        totalPages,
        goToPage,
        setGoToPage,
        mobileAllOrders,
        handlePageSizeChange } = useOrdersHooks()


    return (
        <Row style={{ width: "100%" }}>


            <Col span={24} >

                <div className="page-container">
                    <PagesHeader title=" سفارش ها " />
                    <div className="sub-container">
                        {
                            !isDesktop ?
                                <MobileOrdersCard data={mobileAllOrders} isLoading={isFetching}
                                    handlePageChange={handlePageChange}
                                    pageNumber={pageModel.pageNumber}
                                    pageSize={pageModel.itemsPerPage}
                                    totalPages={totalPages}
                                />
                                :
                                <DesktopOrdersTable
                                    totalPages={totalPages}
                                    goToPage={goToPage}
                                    setGoToPage={setGoToPage}
                                    ordersHistoryData={ordersHistoryData?.Data}
                                    pageModel={pageModel}
                                    handlePageChange={handlePageChange}
                                    handlePageSizeChange={handlePageSizeChange}
                                    isLoading={isFetching}
                                    pageSize={pageModel.itemsPerPage}


                                />

                        }
                    </div>
                </div>
            </Col>
        </Row>
    )
}