import { yupResolver } from "@hookform/resolvers/yup";
import { Image } from "@phosphor-icons/react";
import { Controller, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";

import { api } from "../../../services/api";
import {
  Container,
  Form,
  InputGroup,
  Label,
  Input,
  LabelUpload,
  Select,
  SubmitButton,
  ErrorMessage,
  ContainerCheckbox,
} from "./styles";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const schema = yup.object({
  name: yup.string().required("Digite o nome do produto"),
  price: yup
  .mixed()
  .required("Digite o preço do produto")
  .transform((value) => {
    if (typeof value === "string") {
      return parseFloat(value.replace(",", "."));
    }
    return value;
  })
  .test(
    "is-positive",
    "Digite um valor válido e positivo",
    (value) => typeof value === "number" && value > 0
  ),

  category: yup.object().required("Escolha uma categoria"),
  offer: yup.bool(),
});

export function EditProduct() {
  const [fileName, setFileName] = useState(null);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const product = location.state?.product || {
    name: "",
    price: 0,
    category: null,
  };

  useEffect(() => {
    if (!location.state?.product) {
      navigate("/admin/editar-produto"); // Redireciona para a listagem de produtos
    }
  }, [location.state, navigate]);

  useEffect(() => {
    async function loadCategories() {
      const { data } = await api.get("/categories");
      setCategories(data);
    }
    loadCategories();
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const productFormData = new FormData();

    productFormData.append("name", data.name);
    productFormData.append("price", Math.round(data.price * 100)); // Converte o preço para centavos
    productFormData.append("category_id", data.category.id);
    if (data.file?.[0]) {
      productFormData.append("file", data.file[0]);
    }
    productFormData.append("offer", data.offer);

    await toast.promise(api.put(`/products/${product.id}`, productFormData), {
      pending: "Editando o produto...",
      success: "Produto editado com sucesso",
      error: "Falha ao editar o produto, tente novamente",
    });

    setTimeout(() => {
      navigate("/admin/produtos");
    }, 2000);
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputGroup>
          <Label>Nome</Label>
          <Input
            type="text"
            {...register("name")}
            defaultValue={product.name}
          />
          <ErrorMessage>{errors?.name?.message}</ErrorMessage>
        </InputGroup>

        <InputGroup>
          <Label>Preço</Label>
          <Input
  type="text"
  {...register("price")}
  defaultValue={(product.price / 100).toFixed(2).replace(".", ",")} // Formata para reais
  onBlur={(e) => {
    const formattedValue = e.target.value.replace(",", "."); // Substitui vírgula por ponto
    e.target.value = parseFloat(formattedValue).toFixed(2).replace(".", ","); // Normaliza exibição
  }}
/>
<ErrorMessage>{errors?.price?.message}</ErrorMessage>

        </InputGroup>

        <InputGroup>
          <LabelUpload>
            <Image />
            <input
              type="file"
              {...register("file")}
              accept="image/png, image/jpeg"
              onChange={(e) => {
                setFileName(e.target.files[0]?.name);
                register("file").onChange(e);
              }}
            />
            {fileName || "Upload do Produto"}
          </LabelUpload>
          <ErrorMessage>{errors?.file?.message}</ErrorMessage>
        </InputGroup>

        <InputGroup>
          <Label>Categoria</Label>
          <Controller
            name="category"
            control={control}
            defaultValue={product.category}
            render={({ field }) => (
              <Select
                {...field}
                options={categories}
                getOptionLabel={(category) => category.name}
                getOptionValue={(category) => category.id}
                placeholder="Categorias"
                menuPortalTarget={document.body}
              />
            )}
          />
          <ErrorMessage>{errors?.category?.message}</ErrorMessage>
        </InputGroup>

        <InputGroup>
          <ContainerCheckbox>
            <Label>
              <input
                type="checkbox"
                {...register("offer")}
                defaultChecked={product?.offer}
              />
              Produto em Oferta?
            </Label>
          </ContainerCheckbox>
        </InputGroup>

        <SubmitButton>Editar Produto</SubmitButton>
      </Form>
    </Container>
  );
}
