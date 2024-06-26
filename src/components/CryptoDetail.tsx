import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { AreaChart } from "@mantine/charts";
import { Loader, Container, Title, Badge, Flex, Button } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import "./CryptoDetail.css";

const CryptoDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<{ date: string; "Prix (USD)": number }[]>(
        []
    );
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchCryptoData = async () => {
            try {
                const response = await fetch(
                    `https://api.coincap.io/v2/assets/${id}/history?interval=d1`
                );
                const result = await response.json();

                console.log("Raw data from API:", result);

                const formattedData = result.data.map(
                    (item: { time: number; priceUsd: string }) => ({
                        date: new Date(item.time).toLocaleDateString(),
                        "Prix (USD)": parseFloat(item.priceUsd).toFixed(5),
                    })
                );

                // Filtrer pour obtenir uniquement les 5 dernières valeurs
                const recentData = formattedData.slice(-5);

                console.log("Filtered data for AreaChart:", recentData);

                setData(recentData);
            } catch (error) {
                console.error(
                    "Erreur lors de la récupération des données:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCryptoData();
        }
    }, [id]);

    console.log("Data passed to AreaChart:", data);

    return (
        <Container className="ContainerAll" bg={"#313338"}>
            <Button component={NavLink} to="/">
                <IconArrowLeft stroke={2} />
            </Button>
            <Flex>
                <Title my="md" c="#228be6">
                    Historique des prix de <Badge size="xl">{id}</Badge>
                </Title>
            </Flex>
            {loading ? (
                <Loader size="xl" />
            ) : (
                <AreaChart
                    h={300}
                    data={data}
                    dataKey="date"
                    series={[{ name: "Prix (USD)", color: "blue.6" }]}
                    curveType="linear"
                />
            )}
        </Container>
    );
};

export default CryptoDetail;
