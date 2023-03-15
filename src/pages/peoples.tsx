import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/router";
import {
  Button,
  Container,
  Flex,
  Group,
  LoadingOverlay,
  Title,
} from "@mantine/core";
import { IPeople } from "@/models/people";
import { axios } from "@/lib/axios";
import { Table } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/Navbar";
import Link from "next/link";

const getPeoples = (): Promise<{
  status: "ERROR" | "OK";
  peoples: IPeople[];
}> => {
  return axios.get("/api/people");
};

const PeoplesPage = () => {
  const { data: userData, isLoading } = useUser();
  const router = useRouter();

  const { data: peoplesData } = useQuery(["all-peoples"], getPeoples);

  if (isLoading) return <LoadingOverlay visible={true} overlayBlur={2} />;

  if (!userData || !userData?.user) {
    router.push("/");
  }

  if (!peoplesData) return <LoadingOverlay visible={true} overlayBlur={2} />;

  const rows = peoplesData.peoples.map((people) => (
    <tr key={people._id}>
      <td>{people.name}</td>
      <td>{people.phoneNumber}</td>
      <td>{people.token}</td>
    </tr>
  ));
  return (
    <>
      <Navbar />

      <Container size={600} my={40}>
        <Flex justify="space-between" align="center">
          <Title>Peoples</Title>
          <Button component={Link} href="/add-people">
            Add People
          </Button>
        </Flex>

        <Table mt="xl">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Token</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Container>
    </>
  );
};

export default PeoplesPage;
