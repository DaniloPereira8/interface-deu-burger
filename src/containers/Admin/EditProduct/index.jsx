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

// Definição do schema de validação com Yup
const schema = yup.object({
  name: yup.string().required("Digite o nome do produto"),
  price: yup
    .number()
    .positive()
    .required("Digite o preço do produto")
    .typeError("Digite o preço do produto"),
  category: yup.object().required("Escolha um categoria"),
  offer: yup.bool(),
  file: yup
    .mixed()
    .test("required", "Escolha um arquivo para continuar", (value) => {
      return value && value.length > 0;
    })
    .test("fileSize", "Carregue arquivo até 5mb", (value) => {
      return value && value.length > 0 && value[0].size <= 5242880;
    })
    .test("type", "Carregue apenas imagens PNG e JPEG", (value) => {
      return (
        value &&
        value.length > 0 &&
        (value[0].type === "image/jpeg" || value[0].type === "image/png")
      );
    }),
});

export function EditProduct() {
  const [fileName, setFileName] = useState(null);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Produto vindo do estado da navegação
  const product = location.state?.product || { name: "", price: 0, category: null };
  console.log(product);

  // Verificação para redirecionar caso o produto não seja passado
  useEffect(() => {
    if (!location.state?.product) {
      navigate("/admin/editar-produto"); // Redireciona para a listagem de produtos
    }
  }, [location.state, navigate]);

  // Carrega as categorias ao iniciar
  useEffect(() => {
    async function loadCategories() {
      const { data } = await api.get("/categories");
      setCategories(data);
    }
    loadCategories();
  }, []);

  // Hook para gerenciamento do formulário
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Preenche os valores do formulário com os dados do produto
  useEffect(() => {
    if (product) {
      setValue("name", product.name);
      setValue("price", product.price / 100);
      setValue("category", product.category);
      setValue("offer", product.offer);
    }
  }, [product, setValue]);

  const onSubmit = async (data) => {
    const productFormData = new FormData();

    productFormData.append("name", data.name);
    productFormData.append("price", data.price * 100);
    productFormData.append("category_id", data.category.id);
    productFormData.append("offer", data.offer);

    if (data.file?.[0]) {
      productFormData.append("file", data.file[0]);
    }

    // Envia a requisição PUT para editar o produto
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
          <Input type="text" {...register("name")} />
          <ErrorMessage>{errors?.name?.message}</ErrorMessage>
        </InputGroup>

        <InputGroup>
          <Label>Preço</Label>
          <Input type="number" {...register("price")} />
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
            <input type="checkbox" {...register("offer")} />
            <Label>Produto em Oferta ?</Label>
          </ContainerCheckbox>
        </InputGroup>

        <SubmitButton>Editar Produto</SubmitButton>
      </Form>
    </Container>
  );
}


// import { yupResolver } from "@hookform/resolvers/yup";
// import { Image } from "@phosphor-icons/react";
// import { Controller, useForm } from "react-hook-form";
// import { useLocation, useNavigate } from "react-router-dom";
// import * as yup from "yup";

// import { api } from "../../../services/api";
// import {
//   Container,
//   Form,
//   InputGroup,
//   Label,
//   Input,
//   LabelUpload,
//   Select,
//   SubmitButton,
//   ErrorMessage,
//   ContainerCheckbox,
// } from "./styles";

// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";

// const schema = yup.object({
//   name: yup.string().required("Digite o nome do produto"),
//   price: yup
//     .number()
//     .positive()
//     .required("Digite o preço do produto")
//     .typeError("Digite o preço do produto"),
//   category: yup.object().required("Escolha um categoria"),
//   offer: yup.bool(),
// });

// export function EditProduct() {
//   const [fileName, setFileName] = useState(null);
//   const [categories, setCategories] = useState([]);

//   const navigate = useNavigate();

//   const location = useLocation();

//   const product = location.state?.product || {
//     name: "",
//     price: 0,
//     category: null,
//   };
//   console.log(product);

//   useEffect(() => {
//     if (!location.state?.product) {
//       navigate("/admin/editar-produto"); // Redireciona para a listagem de produtos
//     }
//   }, [location.state, navigate]);

//   useEffect(() => {
//     async function loadCategories() {
//       const { data } = await api.get("/categories");
//       setCategories(data);
//     }
//     loadCategories();
//   }, []);

//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(schema),
//   });
//   const onSubmit = async (data) => {
//     //console.log(data);
//     const productFormData = new FormData();

//     productFormData.append("name", data.name);
//     productFormData.append("price", data.price * 100);
//     productFormData.append("category_id", data.category.id);
//     productFormData.append("file", data.file[0]);
//     productFormData.append("offer", data.offer);

//     await toast.promise(api.put(`/products/${product.id}`, productFormData), {
//       pending: "Editando o produto...",
//       success: "Produto criado com sucesso",
//       error: "Falha ao adicionar o produto, tente novamente",
//     });

//     setTimeout(() => {
//       navigate("/admin/produtos");
//     }, 2000);
//   };

//   return (
//     <Container>
//       <Form onSubmit={handleSubmit(onSubmit)}>
//         <InputGroup>
//           <Label>Nome</Label>
//           <Input
//             type="text"
//             {...register("name")}
//             defaultValue={product.name}
//           />
//           <ErrorMessage>{errors?.name?.message}</ErrorMessage>
//         </InputGroup>

//         <InputGroup>
//           <Label>Preço</Label>
//           <Input
//             type="number"
//             {...register("price")}
//             defaultValue={product.price / 100}
//           />
//           <ErrorMessage>{errors?.price?.message}</ErrorMessage>
//         </InputGroup>

//         <InputGroup>
//           <LabelUpload>
//             <Image />
//             <input
//               type="file"
//               {...register("file")}
//               accept="image/png, image/jpeg"
//               onChange={(value) => {
//                 setFileName(value.target.files[0]?.name);
//                 register("file").onChange(value);
//               }}
//             />
//             {fileName || "Upload do Produto"};
//           </LabelUpload>

//           <ErrorMessage>{errors?.file?.message}</ErrorMessage>
//         </InputGroup>

//         <InputGroup>
//           <Label>Categoria</Label>
//           <Controller
//             name="category"
//             control={control}
//             defaultValue={product.category}
//             render={({ field }) => (
//               <Select
//                 {...field}
//                 options={categories}
//                 getOptionLabel={(category) => category.name}
//                 getOptionValue={(category) => category.id}
//                 placeholder="Categorias"
//                 menuPortalTarget={document.body}
//                 defaultValue={product.category}
//               />
//             )}
//           />

//           <ErrorMessage>{errors?.category?.message}</ErrorMessage>
//         </InputGroup>

//         <InputGroup>
//           <ContainerCheckbox>
//             <Label>
//               <input
//                 type="button"
//                 {...register("offer")}
//                 defaultChecked={product?.offer}
//               />
//               Produto em Oferta ?
//             </Label>
//           </ContainerCheckbox>
//         </InputGroup>

//         <SubmitButton>Editar Produto</SubmitButton>
//       </Form>
//     </Container>
//   );
// }