import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/router";
import { Container, LoadingOverlay, Title } from "@mantine/core";
import { axios } from "@/lib/axios";
import { Table } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { IProject } from "@/models/project";
import Link from "next/link";

const getProjects = (): Promise<{
  status: "ERROR" | "OK";
  projects: IProject[];
}> => {
  return axios.get("/api/project");
};

const PeoplesPage = () => {
  const { data: userData, isLoading } = useUser();
  const router = useRouter();

  const { data: projectsData } = useQuery(["all-projects"], getProjects);

  if (isLoading) return <LoadingOverlay visible={true} overlayBlur={2} />;

  if (!userData || !userData?.user) {
    router.push("/");
  }

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
    <Container size={600} my={40}>
      <Title>Projects</Title>
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
  );
};

export default PeoplesPage;
