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
import { PeopleCredentialsDTO, peopleSchema } from "@/validators";
import { axios } from "@/lib/axios";
import { modals } from "@mantine/modals";
import { Navbar } from "@/Navbar";

const AddPeoplePage = () => {
  const form = useForm<PeopleCredentialsDTO>({
    validate: zodResolver(peopleSchema),
    validateInputOnBlur: true,
    initialValues: {
      name: "",
      phoneNumber: "",
    },
  });
  const { data: userData, isLoading } = useUser();
  const router = useRouter();

  if (isLoading) return <LoadingOverlay visible={true} overlayBlur={2} />;

  if (!userData || !userData?.user) {
    router.push("/");
  }

  const handleAddPeople = async (data: PeopleCredentialsDTO) => {
    const response = (await axios.post("/api/people", data)) as any;

    modals.openConfirmModal({
      centered: true,
      size: "md",
      children: (
        <Text size="xl">
          People created successfully with token: {response.people.token}
        </Text>
      ),
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
          Add People{" "}
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form onSubmit={form.onSubmit(handleAddPeople)}>
            <TextInput
              label="Full Name"
              {...form.getInputProps("name")}
              error={form.errors.name}
            />
            <TextInput
              label="Phone Number"
              mt="md"
              {...form.getInputProps("phoneNumber")}
              error={form.errors.phoneNumber}
            />
            <Button fullWidth mt="xl" type="submit">
              Add People
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default AddPeoplePage;
