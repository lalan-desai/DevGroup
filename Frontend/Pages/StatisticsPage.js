import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';

import { PieChart } from "react-native-chart-kit";
import GetServerURL from '../Controller/Server';
import { StatusBar } from 'expo-status-bar';
import { ScrollView } from 'react-native-gesture-handler';

import { BASIC_AUTH } from "@env";

export default function StatisticsPage({ route, navigation }) {

    //data states
    const [year, setYear] = useState('0000');
    const [data, setData] = useState([]);


    //chart states
    const [genderChartData, setGenderChartData] = useState([]);
    const [paymentChartData, setPaymentChartData] = useState([]);
    const [frequancyChartData, setFrequancyChartData] = useState([]);
    const [figure, setFigure] = useState(false);
    const [yearData, setYearData] = useState([]);


    const [isLoading, setIsLoading] = useState(false);


    const GetYears = async () => {
        await fetch(await GetServerURL() + '/Year.php', {
            headers: { 'Authorization': `Basic ${BASIC_AUTH}==` }
        }).then(response => response.json()).then(data => {
            let years = [];
            data.forEach(element => {
                years.push({ label: element.Year, value: element.Year });
            });
            if (years.length > 0) {

                setYear(String(years[0].value));

            }
            setYearData(years);
        })
    }



    useEffect(() => {
        GetYears();
    }, [])


    const chatConfigData = [
        { label: 'Percentage', value: false },
        { label: 'Absolute', value: true },

    ];

    var genderData = [
        {
            name: "Male",
            population: Number(data['Male Student'] === undefined ? 0 : Number(data['Male Student'])),
            color: "#89C4E1",
            legendFontColor: "#7F7F7F",
        },
        {
            name: "Female",
            population: Number(data['Female Student'] === undefined ? 0 : Number(data['Female Student'])),
            color: "#C85C8E",
            legendFontColor: "#7F7F7F",
        },
    ];


    var frequancyData = [
        {
            name: "Monthly",
            population: Number(data['Monthly'] === undefined ? 0 : Number(data['Monthly'])),
            color: "#FF597B",
            legendFontColor: "#7F7F7F",
        },
        {
            name: "Yearly",
            population: Number(data['Yearly'] === undefined ? 0 : Number(data['Yearly'])),
            color: "#F9B5D0",
            legendFontColor: "#7F7F7F",
        }
    ];

    var paymentData = [
        {
            name: "Pending",
            population: Number(data['Pending'] === undefined ? 0 : Number(data['Pending'])),
            color: "#F55050",
            legendFontColor: "#7F7F7F",
        },
        {
            name: "Paid",
            population: Number(data['Paid'] === undefined ? 0 : Number(data['Paid'])),
            color: "#AEE2FF",
            legendFontColor: "#7F7F7F",
        }
    ];


    function numberWithCommas(x) {
        return x.toString().split('.')[0].length > 3 ? x.toString().substring(0, x.toString().split('.')[0].length - 3).replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + x.toString().substring(x.toString().split('.')[0].length - 3) : x.toString();
    }

    const getChartData = async (data) => {
        setIsLoading(true);
        fetch(await GetServerURL() + '/Statistics.php',
            { method: 'POST', body: JSON.stringify(data), headers: { 'Authorization': `Basic ${BASIC_AUTH}==` } }).then((response) => response.json())
            .then((responseJson) => {
                setData(responseJson);
                setIsLoading(false);
            })
    }

    useEffect(() => {
        getChartData({ year: year });
    }, [year])

    useEffect(() => {
        setGenderChartData(genderData);
        setPaymentChartData(paymentData);
        setFrequancyChartData(frequancyData);

    }, [data])

    return (
        <View style={styles.container}>
            <StatusBar style="dark" backgroundColor='#FFFFFF' translucent={true} />

            {
                isLoading ?
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                    :


                    <ScrollView>
                        <View style={[styles.widgets, { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }]}>
                            <Dropdown
                                statusBarIsTranslucent={true}
                                data={yearData}
                                labelField="label"
                                valueField="value"
                                value={year}
                                placeholder=""
                                selectedTextStyle={{ fontSize: 20 }}
                                onChange={(item) => {
                                    setYear(item.value);
                                }}
                                style={{ width: '55%', backgroundColor: '#f2f2f2', borderRadius: 10, margin: 10, padding: 10, height: 'auto', borderColor: 'blue', alignContent: 'flex-end' }}
                            />

                            <Dropdown
                                statusBarIsTranslucent={true}
                                data={chatConfigData}
                                labelField="label"
                                valueField="value"
                                value={figure}
                                placeholder=""

                                onChange={(item) => {
                                    setFigure(item.value);
                                }}
                                style={{ width: '35%', backgroundColor: '#f2f2f2', borderRadius: 10, margin: 10, padding: 10, fontSize: 20, height: 'auto', borderColor: 'blue' }}
                            />
                        </View>

                        <View style={[styles.widgets, { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 60 }]}>
                            <Text style={{ fontSize: 20 }}>This year income: ₹ {numberWithCommas(Number(data['This Year Income']))}/-</Text>
                        </View>

                        <View style={[styles.widgets, { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 'auto' }]}>

                            <PieChart
                                data={genderChartData}
                                width={350}
                                height={220}

                                chartConfig={{
                                    backgroundColor: "#e26a00",
                                    backgroundGradientFrom: "#fb8c00",
                                    backgroundGradientTo: "#ffa726",
                                    decimalPlaces: 2,
                                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    style: {
                                        borderRadius: 16
                                    }
                                }}
                                accessor="population"
                                backgroundColor="transparent"
                                absolute={figure}
                                hasLegend={true}
                            />
                        </View>

                        <View style={[styles.widgets, { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 'auto' }]}>

                            <PieChart
                                data={paymentChartData}
                                width={350}
                                height={220}
                                chartConfig={{
                                    backgroundColor: "#e26a00",
                                    backgroundGradientFrom: "#fb8c00",
                                    backgroundGradientTo: "#ffa726",
                                    decimalPlaces: 2,
                                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    style: {
                                        borderRadius: 16
                                    }
                                }}
                                accessor="population"
                                backgroundColor="transparent"
                                absolute={figure}
                            />
                        </View>

                        <View style={[styles.widgets, { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 'auto' }]}>

                            <PieChart
                                data={frequancyChartData}
                                width={350}
                                height={220}
                                chartConfig={{
                                    backgroundColor: "#e26a00",
                                    backgroundGradientFrom: "#fb8c00",
                                    backgroundGradientTo: "#ffa726",
                                    decimalPlaces: 2,
                                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    style: {
                                        borderRadius: 16
                                    }
                                }}
                                accessor="population"
                                backgroundColor="transparent"
                                absolute={figure}
                            />
                        </View>
                    </ScrollView>

            }



        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
    },
    widgets: {
        width: '95%',
        margin: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        elevation:5

    }
})

