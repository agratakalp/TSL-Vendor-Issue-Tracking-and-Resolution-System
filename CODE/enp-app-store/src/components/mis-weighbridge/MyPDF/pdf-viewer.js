import React, { useEffect, useState } from "react";
import {
  PDFViewer,
  Document,
  Image,
  Text,
  Page,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import Loader from "../../loader";
import axios from "axios";

const borderColor = "#00519C";

const formatDate = (date, time) => {
    var Time = time ?.split("T")[1];
    return (`${date ?.split("T")[0]} | ${Time ?.split(".")[0]}`)
}
const currDate = new Date();
const endDay = currDate.getDate();
const endMonth = currDate.getMonth() + 1;
const endYear = currDate.getFullYear();
const today = `${endDay}-${endMonth}-${endYear}`;
const styles = StyleSheet.create({
  pageParent: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
  },
  section: {
    margin: 5,
    padding: 1,
    flexGrow: 1,
  },
  page: {
    backgroundColor: "#ffffff",
    flexDirection: "column",
  },
  logo: {
    width: 170,
    height: 100,
  },
  mainHeader: {
    display: "flex",
    fontFamily: "Helvetica-BoldOblique",
    fontSize: 18,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  invoiceDateContainer: {
    flexDirection: "row",
    marginTop: 1,
    marginRight: 25,
    justifyContent: "flex-end",
  },
  invoiceDate: {
    fontSize: 12,
    fontStyle: "bold",
  },
  label: {
    marginRight: 15,
    fontSize: 12,
  },
  headerContainer: {
    marginTop: 5,
    justifyContent: "flex-start",
    width: "50%",
  },
  billTo: {
    marginRight: 10,
  },
  Mainbillto: {
    display: "flex",
    flexDirection: "column",
    marginTop: 3,
    fontSize: 12,
  },
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#3778C2",
  },
  container: {
    flexDirection: "row",
    borderBottomColor: "#00519C",
    backgroundColor: "#00519C",
    color: "#fff",
    borderBottomWidth: 1,
    alignItems: "center",
    height: 15,
    fontStyle: "bold",
    fontSize: 5,
    flexGrow: 1,
  },
  truckNo: {
    width: "7%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  chalanNo: {
    width: "7%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  source: {
    width: "7%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  matName: {
    width: "9%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  custName: {
    width: "9%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  supName: {
    width: "9%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  weighDateTime: {
    width: "8%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  weighShift: {
    width: "3%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    
  },
  weight: {
    width: "4%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  netWeight: {
    width: "4%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  status: {
    width: "5%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  weighType: {
    width: "6%",
  },
  dataRow: {
    flexDirection: "row",
    borderBottomColor: "#3778C2",
    borderBottomWidth: 1,
    alignItems: "center",
    height: 7,
    fontSize: 5,
  },
  dataTruckNo: {
    width: "7%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  dataChalanNo: {
    width: "7%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  dataSource: {
    width: "7%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  dataMatName: {
    width: "9%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  dataCustName: {
    width: "9%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  dataSupName: {
    width: "9%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  dataWeighDateTime: {
    width: "8%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  dataWeighShift: {
    width: "3%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  dataWeight: {
    width: "4%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  dataNetWeight: {
    width: "4%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  dataStatus: {
    width: "5%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  dataFirstWeighType: {
    width: "6%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  dataSecondWeighType: {
    width: "6%",
  },
});

const PDFView = ({ invoice, weigh }) => {
  const [load, setLoad] = useState(false);
  const [address, setAddress] = useState();
  const logoUri = process.env.PUBLIC_URL + "/logo.png";

  useEffect(() => {
    setLoad(true);
    const get_address =
      process.env.REACT_APP_BACKEND_URL + "/misWeighData/get_address";
    axios
      .post(get_address, {
        weigh: weigh,
      })
      .then((resp) => {
        setAddress(resp.data.data);
        setLoad(false);
      })
      .catch((err) => {
        console.log(err);
        setLoad(false);
      });
  }, [weigh]);

  return (
    <>
      {load && <Loader />}
      <div>
        <PDFViewer style={{ width: "100%", height: "500px" }}>
          <Document>
            <Page
              wrap={false}
              size="A4"
              orientation="landscape"
              style={styles.pageParent}
            >
              <View style={styles.section}>
                <View style={styles.mainHeader}>
                  <Image style={styles.logo} src={logoUri} alt="logo" />
                  <Text>TGS MIS Report for weighbridge</Text>
                </View>
                <View style={styles.invoiceDateContainer}>
                  <Text style={styles.label}>Date: </Text>
                  <Text style={styles.invoiceDate}>{today}</Text>
                </View>
                <View style={styles.headerContainer}>
                  <View style={styles.Mainbillto}>
                    <Text style={styles.billTo}>WeighBridge Name :</Text>
                    <Text>{weigh}</Text>
                  </View>
                  <View style={styles.Mainbillto}>
                    <Text style={styles.billTo}>WeighBridge Address :</Text>
                    {address?.map((addr) => {
                      return (
                        <Text>
                          {addr.Adrs1} {addr.Adrs2} {addr.Adrs3} {addr.Adrs4}
                        </Text>
                      );
                    })}
                  </View>
                </View>
                <View style={styles.tableContainer}>
                  {/* Invoice Table Header */}
                  <View style={styles.container}>
                    <Text style={styles.truckNo}>Truck No.</Text>
                    <Text style={styles.weighDateTime}>
                      First weigh Date & Time
                    </Text>
                    <Text style={styles.weighShift}>First weigh shift</Text>
                    <Text style={styles.weighType}>First weigh type</Text>
                    <Text style={styles.weight}>First weight</Text>
                    <Text style={styles.weighDateTime}>
                      Second weigh Date & Time
                    </Text>
                    <Text style={styles.weighShift}>Second weigh shift</Text>
                    <Text style={styles.weighType}>Second weigh type</Text>
                    <Text style={styles.weight}>Second weight</Text>
                    <Text style={styles.netWeight}>Net Weight</Text>
                    <Text style={styles.status}>Status</Text>               
                    <Text style={styles.chalanNo}>Chalan No.</Text>
                    <Text style={styles.source}>Source</Text>
                    <Text style={styles.matName}>Material</Text>
                    <Text style={styles.custName}>Customer</Text>
                    <Text style={styles.supName}>Supplier</Text>
                  </View>
                  {invoice.map((item) => {
                    return (
                      <View style={styles.dataRow} key={item.sno}>
                        <Text style={styles.dataTruckNo}>{item.TruckNo}</Text>
                        <Text style={styles.dataWeighDateTime}>{formatDate(item.FDate,item.Ftime)}</Text>
                        <Text style={styles.dataWeighShift}>{item.FShift}</Text>
                        <Text style={styles.dataFirstWeighType}>{item.F == "T" ? "Tare Weight" : item.F == "G" ? "Gross Weight" : ""}</Text>
                        <Text style={styles.dataWeight}>{Number(item.FWeight).toFixed(3)}</Text>
                        <Text style={styles.dataWeighDateTime}>{formatDate(item.SDate,item.Stime)}</Text>
                        <Text style={styles.dataWeighShift}>{item.SShift}</Text>
                        <Text style={styles.dataSecondWeighType}>{item.S == "T" ? "Tare Weight" : item.S == "G" ? "Gross Weight" : ""}</Text>
                        <Text style={styles.dataWeight}>{Number(item.SWeight).toFixed(3)}</Text>
                        <Text style={styles.dataNetWeight}>{Number(item.NetWt).toFixed(3)}</Text>
                        <Text style={styles.dataStatus}>{item.Status == "C" ? "Completed" : "Not Complete"}</Text>                      
                        <Text style={styles.dataChalanNo}>{item.ChalanNo}</Text>
                        <Text style={styles.dataSource}>{item.Source}</Text>
                        <Text style={styles.dataMatName}>{item.MatName}</Text>
                        <Text style={styles.dataCustName}>{item.CustName}</Text>
                        <Text style={styles.dataSupName}>{item.SupName}</Text>
                      </View>
                    );
                  })}
                  {/* <InvoiceTableRow items={invoice} /> */}
                </View>
              </View>
            </Page>
          </Document>
        </PDFViewer>
      </div>
    </>
  );
};

export default PDFView;
