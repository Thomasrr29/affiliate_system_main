import { useState } from "react"
import { User, Mail, Phone, Tag, Save } from 'lucide-react';
import ErrorPageComponent from "../../components/ErrorPage";
import LoadingComponent from "../../components/LoadingRow";
import { ClientService } from "../../services/affiliateServices";
import type { ClientType, CreateClientData } from "../../types/base";



const CreateNewAffiliate = () => {

    const [dataClient, setDataClient] = useState<CreateClientData>({
        name: "",
        email: "",
        phone: "",
        client_type: 'CLIENT' as ClientType
    })
    const [error, setError] = useState<string>('')
    const [formIssues, setFormIssues] = useState<Record<string, string>>({})
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const validateForm = (data: CreateClientData): boolean => {

        const newErrors: Record<string, string> = {};

        // Validaciones requeridas
        if (!data.name.trim()) {
        newErrors.name = 'El nombre es requerido';
        }

        if (!data.email.trim()) {
        newErrors.email = 'El email es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dataClient.email)) {
        newErrors.email = 'Email inválido';
        }

        setFormIssues(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const updateFormData = (field: string, value: any) => {

        setDataClient(prev => ({
            ...prev,
            [field]: value
        })
        )

    }

    const handleSubmit = async (formData: FormData) => {

        const formObject = Object.fromEntries(formData);

        const formObjectTyped: CreateClientData = {
            name: String(formObject.name || ""),
            email: String(formObject.email || ""),
            phone: String(formObject.phone || ""),
            client_type: formObject.client_type as ClientType
        };

        console.log("THE CLIENT TYPE IS: ", formObjectTyped.client_type)

        if(!validateForm(formObjectTyped)) return 

        setIsLoading(true)

        try {

            console.log('por fin lo meti')


            console.log("FORM TYPED: ", formObjectTyped)
            setDataClient((prev) => ({
                ...prev,
                ...formObjectTyped
            }))

            const response = await ClientService.create(dataClient)
            console.log(response)

        } catch(error: any ){

            console.error(error)
            setError(error.message)

        } finally {
            setIsLoading(false)
        }

    }

    if(isLoading) return <LoadingComponent />
    if(error) return <ErrorPageComponent message={error}/>

    return (
    
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 my-10">
        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <form 
          action={handleSubmit}
          className="p-8 space-y-8">
            {/* Información Personal */}
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <User className="w-6 h-6 text-blue-600" />
                  Información Personal
                </h2>
                <p className="text-sm text-gray-500 mt-1">Datos básicos del cliente</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Nombre */}
                <div className="lg:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    onChange={
                        (e) => updateFormData('name', e.target.value)
                    }
                    value={dataClient.name}
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Ingresa el nombre completo del cliente"
                  />
                  {/* Error message container */}
                  {formIssues.name && <p className="mt-1 font-normal text-sm text-red-400">{formIssues.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Correo electrónico *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      onChange={
                        (e) => updateFormData('email', e.target.value)
                      }  
                      value={dataClient.email}
                      type="email"
                      id="email"
                      name="email"
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="ejemplo@correo.com"
                    />
                  </div>
                  {/* Error message container */}
                  {formIssues.email && <p className="mt-1 text-red-400 font-normal text-sm">{formIssues.email}</p>}
                </div>

                {/* Teléfono */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Celular: 
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      onChange={
                        (e) => updateFormData('phone', e.target.value)
                      }  
                      value={dataClient.phone}
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="+57 300 123 4567"
                    />
                  </div>
                  {formIssues.phone && <p className="text-red-400 text-sm font-normal">{formIssues.phone}</p>}
                </div>
              </div>
            </div>

            {/* Configuración de Afiliado */}
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Tag className="w-6 h-6 text-blue-600" />
                  Configuración de Afiliado
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tipo de Cliente */}
                <div>
                  <label htmlFor="client_type" className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Cliente *
                  </label>
                  <select
                    onChange={
                        (e) => updateFormData('client_type', e.target.value)
                    }
                    value={dataClient.client_type}
                    id="client_type"
                    name="client_type"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="CLIENT">Cliente</option>
                    <option value="AFFILIATE">Afiliado</option>
                    <option value="ATHLETE">Atleta</option>
                    <option value="AMBASSADOR">Embajador</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Crear Cliente
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateNewAffiliate
