import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/router";
import {
  Button,
  Container,
  LoadingOverlay,
  Paper,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { NewProjectCredentialsDTO, projectSchema } from "@/validators";
import { axios } from "@/lib/axios";
import { modals } from "@mantine/modals";
import { Navbar } from "@/Navbar";

const AddProject = () => {
  const form = useForm<NewProjectCredentialsDTO>({
    validate: zodResolver(projectSchema),
    validateInputOnBlur: true,
    initialValues: {
      name: "",
    },
  });
  const { data: userData, isLoading } = useUser();
  const router = useRouter();

  if (isLoading) return <LoadingOverlay visible={true} overlayBlur={2} />;

  if (!userData || !userData?.user) {
    router.push("/");
  }

  const handleAddPeople = async (data: NewProjectCredentialsDTO) => {
    await axios.post("/api/project", data);

    modals.openConfirmModal({
      title: "People created!!",
      children: <Text size="sm">Project created successfully</Text>,
      labels: { confirm: "Confirm", cancel: "Cancel" },
    });
  };

  return (
    <>
      <Navbar />

      <Container size={420} my={40}>
        <Title
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 900,
          })}
        >
          Welcome back!
        </Title>
        <Text color="dimmed" size="md" align="center" mt={5} weight="bold">
          Add Project
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form onSubmit={form.onSubmit(handleAddPeople)}>
            <TextInput
              label="Name"
              {...form.getInputProps("name")}
              error={form.errors.name}
            />

            <Button fullWidth mt="xl" type="submit">
              Add Project
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default AddProject;
