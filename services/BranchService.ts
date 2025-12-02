import { ApiResponse } from "@/types/api";
import { User } from "@/types/user";
import useApi from "@/utils/useApi";
import Configuration from "@/config/constants";

class BranchService {
    static async getAllBranches(){
        const { api } = useApi();
        const result = await fetch(``);
        const data = await result.json();
        return data;
    }
}

export default BranchService;