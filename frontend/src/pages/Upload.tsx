import Form from "@/components/Form";
import FullPage from "@/components/FullPage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUpload } from "@/hooks/food/useUpload";
import { Label } from "@radix-ui/react-label";
import { useForm } from "react-hook-form";

type FormValues = {
  image: FileList;
  name: string;
  qty: number;
  date: string;
};

const Upload = () => {
  const { upload, isLoading, error } = useUpload();

  const { register, handleSubmit, reset } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    const file = data.image[0];

    upload({
      image: file,
      food_name: data.name,
      quantity: Number(data.qty),
      date_logged: new Date(data.date),
    });

    reset();
  };

  return (
    <FullPage className="flex flex-col pt-10 gap-3 justify-start">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Upload a Nutrition Label</CardTitle>
        </CardHeader>
        <CardContent>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.FormRow>
              <Label htmlFor="image">Nutrition Label</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                {...register("image", { required: "Image required" })}
              />
            </Form.FormRow>

            <Form.FormRow>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Name of item"
                {...register("name", { required: "Name required" })}
              />
            </Form.FormRow>

            <Form.FormRow>
              <Label htmlFor="qty">Quantity</Label>
              <Input
                id="qty"
                type="number"
                min="1"
                step="1"
                placeholder="Quantity"
                defaultValue="1"
                {...register("qty", { required: "Quantity required" })}
              />
            </Form.FormRow>

            <Form.FormRow>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                defaultValue="2025-10-04"
                {...register("date", { required: "Date required" })}
              />
            </Form.FormRow>

            <Form.FormRow>
              <Button type="submit" disabled={isLoading} className="min-w-20">
                Upload
              </Button>
            </Form.FormRow>
          </Form>
        </CardContent>
      </Card>
    </FullPage>
  );
};

export default Upload;
