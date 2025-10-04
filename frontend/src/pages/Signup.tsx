import Form from "@/components/Form";
import FullPage from "@/components/FullPage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSignup, type SignupArgs } from "@/hooks/auth/useSignup";
import "react-hook-form";
import { useForm, Controller } from "react-hook-form";

const Signup = () => {
  const { signup, isLoading, error } = useSignup();

  const { register, handleSubmit, control } = useForm<SignupArgs>();

  const onSubmit = (payload: SignupArgs) => {
    signup(payload);
  };

  const onError = () => {
    console.error("Error with signup");
  };

  return (
    <FullPage>
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>Signup</CardTitle>
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
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                min="0"
                step="1"
                disabled={isLoading}
                placeholder="Age"
                {...register("age", { required: "Age required" })}
              />
            </Form.FormRow>

            <Form.FormRow>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                min="0"
                step="0.1"
                disabled={isLoading}
                placeholder="Weight (kg)"
                {...register("weight", { required: "Weight required" })}
              />
            </Form.FormRow>

            <Form.FormRow>
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                min="0"
                step="0.1"
                disabled={isLoading}
                placeholder="Height (cm)"
                {...register("height", { required: "Height required" })}
              />
            </Form.FormRow>

            <Form.FormRow>
              <Label htmlFor="gender">Gender</Label>
              <Controller
                name="gender"
                control={control}
                rules={{ required: "Gender required" }}
                render={({ field }) => (
                  <Select disabled={isLoading} onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Gender</SelectLabel>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </Form.FormRow>

            <Form.FormRow>
              <Label htmlFor="activityLevel">Activity Level</Label>
              <Controller
                name="activityLevel"
                control={control}
                rules={{ required: "Activity level required" }}
                render={({ field }) => (
                  <Select disabled={isLoading} onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Select your activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Activity Level</SelectLabel>
                        <SelectItem value="Sedentary">Sedentary</SelectItem>
                        <SelectItem value="Lightly active">Lightly active</SelectItem>
                        <SelectItem value="Moderately active">Moderately active</SelectItem>
                        <SelectItem value="Very active">Very active</SelectItem>
                        <SelectItem value="Extra active">Extra active</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </Form.FormRow>

            <Form.FormRow>
              <Button type="submit" disabled={isLoading} className="min-w-20">
                Signup
              </Button>
            </Form.FormRow>
          </Form>
        </CardContent>
      </Card>
    </FullPage>
  );
};

export default Signup;
