import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/router";
import { Container, LoadingOverlay, Text, Title } from "@mantine/core";
import { axios } from "@/lib/axios";
import { Table } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { IProject } from "@/models/project";
import { IUser } from "@/models/user";
import { IPeople } from "@/models/people";
import { Navbar } from "@/Navbar";

const getProjects = (
  id: string
): Promise<{
  status: "ERROR" | "OK";
  project: IProject;
  users: IPeople[];
}> => {
  return axios.get(`/api/project/${id}`);
};

const SingleProjectPage = () => {
  const { data: userData, isLoading } = useUser();
  const router = useRouter();

  const { data: projectData } = useQuery(
    ["project", router.query.id],
    () => getProjects(router.query.id as string),
    {
      enabled: router.isReady,
    }
  );

  if (isLoading) return <LoadingOverlay visible={true} overlayBlur={2} />;

  if (!userData || !userData?.user) {
    router.push("/");
  }

  if (!projectData) return <LoadingOverlay visible={true} overlayBlur={2} />;

  const rows = projectData.users.map((user) => (
    <tr key={user._id}>
      <td>{user.name}</td>
      <td>{user.phoneNumber}</td>
      <td>{user.token}</td>
    </tr>
  ));
  return (
    <>
      <Navbar />
      <Container size={600} my={40}>
        <Title>Project</Title>
        <Text mt={"xl"}>Project Title: {projectData.project.name}</Text>
        <Text mt={"xs"}>
          Number of votes: {projectData.project.votes.length}
        </Text>

        <Title size={"h4"} mt={"xl"} order={2}>
          Voters List
        </Title>
        <Table mt="sm">
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

export default SingleProjectPage;
