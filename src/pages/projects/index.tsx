import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/router";
import { Button, Container, Flex, LoadingOverlay, Title } from "@mantine/core";
import { axios } from "@/lib/axios";
import { Table } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { IProject } from "@/models/project";
import Link from "next/link";
import { Navbar } from "@/Navbar";

const getProjects = (): Promise<{
  status: "ERROR" | "OK";
  projects: IProject[];
}> => {
  return axios.get("/api/project");
};

const PeoplesPage = () => {
  const router = useRouter();

  const { data: projectsData } = useQuery(["all-projects"], getProjects);

  if (!projectsData) return <LoadingOverlay visible={true} overlayBlur={2} />;

  const rows = projectsData.projects.map((project) => (
    <tr key={project._id}>
      <td>
        <Link href={`/projects/${project._id}`}>{project.name}</Link>
      </td>
      <td>{(project.votes as any).length}</td>
    </tr>
  ));
  return (
    <>
      <Navbar />

      <Container size={600} my={40}>
        <Flex justify="space-between" align="center">
          <Title>Projects</Title>
          <Button component={Link} href="/add-project">
            Add Project
          </Button>
        </Flex>
        <Table mt="xl">
          <thead>
            <tr>
              <th>Name</th>
              <th>Votes</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Container>
    </>
  );
};

export default PeoplesPage;
