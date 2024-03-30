import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { RegisterStudentUseCase } from './register-student';
import { FakeHasher } from 'test/cryptography/fake-hasher';

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let fakeHasher: FakeHasher;

let sut: RegisterStudentUseCase;

describe('Register Student',() => {
    beforeEach(() => {
        inMemoryStudentsRepository = new InMemoryStudentsRepository();
        fakeHasher = new FakeHasher();

        sut = new RegisterStudentUseCase(inMemoryStudentsRepository,fakeHasher);
    });

    it('should be able to regiser a new student', async () => {	
        const result = await sut.execute({
            email: 'teste@teste.com',
            name: 'Teste',
            password: 'Teste123@'
        });
	
        expect(result.isRight()).toBe(true);
        expect(result.value).toEqual({
            student: inMemoryStudentsRepository.items[0]
        });
    });	

    it('should hash student password upon registration', async () => {	
        const result = await sut.execute({
            email: 'teste@teste.com',
            name: 'Teste',
            password: 'Teste123@'
        });

        const hashedPassword = await fakeHasher.hash('Teste123@');
	
        expect(result.isRight()).toBe(true);
        expect(inMemoryStudentsRepository.items[0].password).toEqual(hashedPassword);
    });	
});
