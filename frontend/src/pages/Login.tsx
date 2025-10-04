import Form from "@/components/Form";
import FullPage from "@/components/FullPage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin, type LoginArgs } from "@/hooks/auth/useLogin";
import { useForm } from "react-hook-form";

const Login = () => {
  const { login, isLoading, error } = useLogin();

  const { register, handleSubmit } = useForm<LoginArgs>();

  const onSubmit = (payload: LoginArgs) => {
    login(payload);
  };

  const onError = () => {
    console.error("Error with login");
  };

  return (
    <FullPage>
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form onSubmit={handleSubmit(onSubmit, onError)}>
            <Form.FormRow>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                disabled={isLoading}
                placeholder="Name"
                {...register("name", { required: "Name required" })}
              />
            </Form.FormRow>

            <Form.FormRow>
              <Button type="submit" disabled={isLoading} className="min-w-20">
                Login
              </Button>
            </Form.FormRow>
          </Form>
        </CardContent>
      </Card>
    </FullPage>
  );
};

export default Login;
