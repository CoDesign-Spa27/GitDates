import { Github } from "lucide-react"
import { Button } from "./ui/button"
import { AsyncFunctionType } from "@/types/func"
import { Card } from "./ui/card"

export const CreateGitDateProfile = ({
    handleCreateProfile
}:{
    handleCreateProfile : AsyncFunctionType
}) =>{
    return (
         <div className="min-h-screen   flex items-center justify-center p-4">
        <Card className=" rounded-3xl p-8  max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gitdate flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Github className="w-8 h-8 text-gray-300" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Create Your Profile
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Get started by creating your GitHub profile in just one click.
          </p>
          <Button
            onClick={handleCreateProfile}
          >
            Create Profile
          </Button>
        </Card>
      </div>
    )
}