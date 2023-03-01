import { UserBusiness } from "../../src/business/UserBusiness"
import { DeleteUserInputDTO, LoginInputDTO } from "../../src/dtos/userDTO"
import { BadRequestError } from "../../src/errors/BadRequestError"
import { NotFoundError } from "../../src/errors/NotFoundError"
import { HashManagerMock } from "../mocks/HashManagerMock"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../mocks/UserDatabaseMock"

describe("delete", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )

    test("testar token se é string", async () => {
        expect.assertions(2)
        const input: DeleteUserInputDTO = {
            idToDelete: "id-mock-normal",
            token: 111
        }
        try {
            await userBusiness.deleteUser(input)
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("requer token")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("testar token se é válido", async () => {
        const input: DeleteUserInputDTO = {
            idToDelete: "id-mock-normal",
            token: "token-nao-valido"
        }

        const result = async () => {
            await userBusiness.deleteUser(input)
        }

        expect(result).rejects.toBeInstanceOf(BadRequestError)
    })

    test("testar se somente admins podem deletar contas", async () => {
        expect.assertions(1)
        const input: DeleteUserInputDTO = {
            idToDelete: "id-mock-normal",
            token: "token-mock-normal"
        }
        try {
            await userBusiness.deleteUser(input)
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("somente admins podem deletar contas")
            }
        }
    })

    test("testar se a id existe", async () => {
        // expect.assertions(2)
        const input: DeleteUserInputDTO = {
            idToDelete: "id-nao-existe",
            token: "token-mock-admin"
        }

        const result = async () => {
            await userBusiness.deleteUser(input)
        }

        expect(result).rejects.toBeInstanceOf(NotFoundError)
        // try {
        //     await userBusiness.deleteUser(input)
        // } catch (error) {
        //     if (error instanceof NotFoundError) {
        //         expect(error.message).toBe("'id' não existe")
        //         expect(error.statusCode).toBe(404)
        //     }
        // }
    })

    test("testar delete by id", async () => {
        const input: DeleteUserInputDTO = {
            idToDelete: "id-mock-normal",
            token: "token-mock-admin"
        }
        const result = await userBusiness.deleteUser(input)

        expect(result).toEqual({
            message: "usuário deletado"
        })
    })
})
