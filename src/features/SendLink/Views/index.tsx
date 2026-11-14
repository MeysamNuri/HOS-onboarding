import { Row, Col } from "antd";
import DesktopSentLinksTable from "../Components/desktopSendLinksTable";
import useSentLinksHooks from "../Hooks/sentLinksHook";
import MobileSentLinksCard from "../Components/mobileSentLinks";
import "@core/assets/styles/mobileFilters.scss"

import "../../Orders/Views/styles.scss"
import PagesHeader from "@/core/components/pagesHeader";
export default function SentLinks() {
    const { isMobile,

        isFetching,
        ordersHistoryData,
        pageModel,
        handlePageChange,
        handleCopy,
        totalPages,
        goToPage,
        setGoToPage,
        mobileAllSentLinks,
        handeleRecordDetails,
        selectedRecordDetails,
        hadleCloseDetailsModal,
        showDetailssModal,
        handlePageSizeChange } = useSentLinksHooks()

    return (

        <Row style={{ width: "100%" }}>


            <Col span={24} >
                <div className="page-container ">
                    <PagesHeader title=" گزارش ارسال ها" />
                    <div className="sub-container">

                        {
                            isMobile ?
                                <MobileSentLinksCard data={mobileAllSentLinks} isLoading={isFetching}
                                    handlePageChange={handlePageChange}
                                    pageNumber={pageModel.pageNumber}
                                    pageSize={pageModel.itemsPerPage}
                                    totalPages={totalPages}
                                />
                                :
                                <DesktopSentLinksTable
                                    totalPages={totalPages}
                                    goToPage={goToPage}
                                    setGoToPage={setGoToPage}
                                    ordersHistoryData={ordersHistoryData?.Data}
                                    pageModel={pageModel}
                                    handlePageChange={handlePageChange}
                                    handlePageSizeChange={handlePageSizeChange}
                                    handleCopy={handleCopy}
                                    isLoading={isFetching}
                                    pageSize={pageModel.itemsPerPage}
                                    handeleRecordDetails={handeleRecordDetails}
                                    selectedRecordDetails={selectedRecordDetails}
                                    hadleCloseDetailsModal={hadleCloseDetailsModal}
                                    showDetailssModal={showDetailssModal}


                                />

                        }
                    </div>
                </div>
            </Col>
        </Row>
    )
}
